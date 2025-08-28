package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

type Handlers struct {
	app          *pocketbase.PocketBase
	emailService *EmailService
}

type LeaderboardEntry struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	Score           int    `json:"score"`
	LevelsCompleted int    `json:"levelsCompleted"`
	CompletionTime  int    `json:"completionTime,omitempty"`
	Created         string `json:"created,omitempty"`
	Approved        bool   `json:"approved"`
}

type PlayerStats struct {
	Rank         *int              `json:"rank"`
	TotalPlayers int               `json:"totalPlayers"`
	Entry        *LeaderboardEntry `json:"entry"`
}

type SubmitScoreRequest struct {
	Name            string `json:"name"`
	Identifier      string `json:"identifier"`
	Score           int    `json:"score"`
	LevelsCompleted int    `json:"levelsCompleted"`
	CompletionTime  int    `json:"completionTime"`
}

func NewHandlers(app *pocketbase.PocketBase) *Handlers {
	return &Handlers{
		app:          app,
		emailService: NewEmailService(app),
	}
}

func (h *Handlers) RegisterRoutes(se *core.ServeEvent) {
	se.Router.GET("/api/leaderboard", h.getLeaderboard)
	se.Router.GET("/api/leaderboard/player/{identifier}", h.getPlayerStats)
	se.Router.POST("/api/leaderboard/submit", h.submitScore)

	// Signed admin endpoints for email links - these are the only way to moderate
	se.Router.GET("/admin/approve/{id}/{signature}", h.signedApproveScore)
	se.Router.POST("/admin/approve/{id}/{signature}", h.signedApproveScore)
	se.Router.GET("/admin/delete/{id}/{signature}", h.signedDeleteScore)
	se.Router.POST("/admin/delete/{id}/{signature}", h.signedDeleteScore)
}

func (h *Handlers) getLeaderboard(e *core.RequestEvent) error {
	limit := 10
	if l := e.Request.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 && parsed <= 50 {
			limit = parsed
		}
	}

	records, err := h.app.FindRecordsByFilter(
		"leaderboard",
		"approved = true",
		"-score",
		limit,
		0,
	)
	if err != nil {
		return e.InternalServerError("Failed to fetch leaderboard", err)
	}

	entries := make([]LeaderboardEntry, len(records))
	for i, record := range records {
		entries[i] = LeaderboardEntry{
			ID:              record.Id,
			Name:            record.GetString("name"),
			Score:           record.GetInt("score"),
			LevelsCompleted: record.GetInt("levels_completed"),
			CompletionTime:  record.GetInt("completion_time"),
			Created:         record.GetDateTime("created").Time().Format(time.RFC3339),
			Approved:        record.GetBool("approved"),
		}
	}

	return e.JSON(http.StatusOK, entries)
}

func (h *Handlers) getPlayerStats(e *core.RequestEvent) error {
	identifier := e.Request.PathValue("identifier")

	// Get player's entry
	playerRecords, err := h.app.FindRecordsByFilter(
		"leaderboard",
		fmt.Sprintf("identifier = '%s' && approved = true", identifier),
		"-score",
		1,
		0,
	)

	var playerEntry *LeaderboardEntry
	if err == nil && len(playerRecords) > 0 {
		record := playerRecords[0]
		playerEntry = &LeaderboardEntry{
			ID:              record.Id,
			Name:            record.GetString("name"),
			Score:           record.GetInt("score"),
			LevelsCompleted: record.GetInt("levels_completed"),
			CompletionTime:  record.GetInt("completion_time"),
			Created:         record.GetDateTime("created").Time().Format(time.RFC3339),
			Approved:        record.GetBool("approved"),
		}
	}

	// Get total player count
	totalCount, err := h.getTotalPlayerCount()
	if err != nil {
		totalCount = 0
	}

	// Calculate rank if player exists
	var rank *int
	if playerEntry != nil {
		betterScores, err := h.app.FindRecordsByFilter(
			"leaderboard",
			fmt.Sprintf("score > %d && approved = true", playerEntry.Score),
			"",
			1,
			0,
		)
		if err == nil {
			playerRank := len(betterScores) + 1
			rank = &playerRank
		}
	}

	stats := PlayerStats{
		Rank:         rank,
		TotalPlayers: totalCount,
		Entry:        playerEntry,
	}

	return e.JSON(http.StatusOK, stats)
}

func (h *Handlers) submitScore(e *core.RequestEvent) error {
	var req SubmitScoreRequest
	if err := e.BindBody(&req); err != nil {
		return e.BadRequestError("Invalid request body", err)
	}

	// Sanitize name
	sanitizedName := h.sanitizeName(req.Name)
	if sanitizedName == "" {
		return e.BadRequestError("Invalid name", nil)
	}

	// Validate score (basic sanity check)
	if req.Score < 0 || req.Score > 10000 || req.LevelsCompleted < 0 || req.LevelsCompleted > 20 {
		return e.BadRequestError("Invalid score or levels", nil)
	}

	// Check if player already exists
	existingRecords, err := h.app.FindRecordsByFilter(
		"leaderboard",
		fmt.Sprintf("identifier = '%s'", req.Identifier),
		"",
		1,
		0,
	)

	// No IP collection for privacy reasons

	collection, err := h.app.FindCollectionByNameOrId("leaderboard")
	if err != nil {
		return e.InternalServerError("Failed to find collection", err)
	}

	if len(existingRecords) > 0 {
		// Update existing record if better score
		existing := existingRecords[0]
		if existing.GetInt("score") < req.Score {
			existing.Set("name", sanitizedName)
			existing.Set("score", req.Score)
			existing.Set("levels_completed", req.LevelsCompleted)
			existing.Set("completion_time", req.CompletionTime)
			existing.Set("approved", false) // Require re-approval

			if err := h.app.Save(existing); err != nil {
				return e.InternalServerError("Failed to update score", err)
			}

			// Send moderation email async
			go h.emailService.SendModerationEmail(existing.Id, sanitizedName, req.Score, req.LevelsCompleted, "", false, h)

			return e.JSON(http.StatusOK, map[string]interface{}{
				"message": "Score updated successfully",
				"success": true,
			})
		}
		return e.JSON(http.StatusOK, map[string]interface{}{
			"message": "Existing score is better",
			"success": false,
		})
	}

	// Create new record
	record := core.NewRecord(collection)
	record.Set("name", sanitizedName)
	record.Set("identifier", req.Identifier)
	record.Set("score", req.Score)
	record.Set("levels_completed", req.LevelsCompleted)
	record.Set("completion_time", req.CompletionTime)
	record.Set("approved", false) // Require approval

	if err := h.app.Save(record); err != nil {
		return e.InternalServerError("Failed to save score", err)
	}

	// Send moderation email async
	go h.emailService.SendModerationEmail(record.Id, sanitizedName, req.Score, req.LevelsCompleted, "", true, h)

	return e.JSON(http.StatusOK, map[string]interface{}{
		"message": "Score submitted successfully",
		"success": true,
	})
}

// Signed admin endpoints - show confirmation pages first
func (h *Handlers) signedApproveScore(e *core.RequestEvent) error {
	id := e.Request.PathValue("id")
	signature := e.Request.PathValue("signature")

	if !h.verifySignature("approve", id, signature) {
		return e.BadRequestError("Invalid signature", nil)
	}

	// Check if this is the confirmation (POST request)
	if e.Request.Method == "POST" {
		return h.doApproveScore(e, id)
	}

	// Show confirmation page (GET request)
	record, err := h.app.FindRecordById("leaderboard", id)
	if err != nil {
		return e.NotFoundError("Score not found", err)
	}

	html := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
    <title>Approve Score - Cookie Banner Clicker</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .card { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .score-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .buttons { display: flex; gap: 15px; justify-content: center; margin-top: 30px; }
        .btn { padding: 12px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; text-decoration: none; display: inline-block; text-align: center; }
        .btn-approve { background: #28a745; color: white; }
        .btn-approve:hover { background: #218838; }
        .btn-cancel { background: #6c757d; color: white; }
        .btn-cancel:hover { background: #5a6268; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>🏆 Approve Leaderboard Score</h1>
            <p>Review this submission before approving it for the public leaderboard.</p>
        </div>
        
        <div class="score-details">
            <h3>Score Details:</h3>
            <p><strong>Player Name:</strong> %s</p>
            <p><strong>Score:</strong> %d points</p>
            <p><strong>Levels Completed:</strong> %d/20</p>
            <p><strong>Completion Time:</strong> %d seconds</p>
            <p><strong>Submitted:</strong> %s</p>
        </div>
        
        <div class="buttons">
            <form method="POST" style="display: inline;">
                <button type="submit" class="btn btn-approve">✅ Approve Score</button>
            </form>
            <a href="javascript:window.close()" class="btn btn-cancel">❌ Cancel</a>
        </div>
        
        <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #666;">
            This link is secure and can only be accessed by authorized administrators.
        </p>
    </div>
</body>
</html>`,
		record.GetString("name"),
		record.GetInt("score"),
		record.GetInt("levels_completed"),
		record.GetInt("completion_time")/1000,
		record.GetDateTime("created").Time().Format("2006-01-02 15:04:05"))

	return e.String(http.StatusOK, html)
}

func (h *Handlers) signedDeleteScore(e *core.RequestEvent) error {
	id := e.Request.PathValue("id")
	signature := e.Request.PathValue("signature")

	if !h.verifySignature("delete", id, signature) {
		return e.BadRequestError("Invalid signature", nil)
	}

	// Check if this is the confirmation (POST request)
	if e.Request.Method == "POST" {
		return h.doDeleteScore(e, id)
	}

	// Show confirmation page (GET request)
	record, err := h.app.FindRecordById("leaderboard", id)
	if err != nil {
		return e.NotFoundError("Score not found", err)
	}

	html := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
    <title>Delete Score - Cookie Banner Clicker</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .card { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .score-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; color: #856404; }
        .buttons { display: flex; gap: 15px; justify-content: center; margin-top: 30px; }
        .btn { padding: 12px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; text-decoration: none; display: inline-block; text-align: center; }
        .btn-delete { background: #dc3545; color: white; }
        .btn-delete:hover { background: #c82333; }
        .btn-cancel { background: #6c757d; color: white; }
        .btn-cancel:hover { background: #5a6268; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>🗑️ Delete Leaderboard Score</h1>
            <p>Review this submission before permanently removing it.</p>
        </div>
        
        <div class="score-details">
            <h3>Score Details:</h3>
            <p><strong>Player Name:</strong> %s</p>
            <p><strong>Score:</strong> %d points</p>
            <p><strong>Levels Completed:</strong> %d/20</p>
            <p><strong>Completion Time:</strong> %d seconds</p>
            <p><strong>Submitted:</strong> %s</p>
        </div>
        
        <div class="warning">
            <strong>⚠️ Warning:</strong> This action cannot be undone. The score will be permanently removed from the leaderboard.
        </div>
        
        <div class="buttons">
            <form method="POST" style="display: inline;">
                <button type="submit" class="btn btn-delete" onclick="return confirm('Are you sure you want to delete this score? This action cannot be undone.')">🗑️ Delete Score</button>
            </form>
            <a href="javascript:window.close()" class="btn btn-cancel">❌ Cancel</a>
        </div>
        
        <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #666;">
            This link is secure and can only be accessed by authorized administrators.
        </p>
    </div>
</body>
</html>`,
		record.GetString("name"),
		record.GetInt("score"),
		record.GetInt("levels_completed"),
		record.GetInt("completion_time")/1000,
		record.GetDateTime("created").Time().Format("2006-01-02 15:04:05"))

	return e.String(http.StatusOK, html)
}

// Actual action functions called after confirmation
func (h *Handlers) doApproveScore(e *core.RequestEvent, id string) error {
	record, err := h.app.FindRecordById("leaderboard", id)
	if err != nil {
		return e.NotFoundError("Score not found", err)
	}

	record.Set("approved", true)
	if err := h.app.Save(record); err != nil {
		return e.InternalServerError("Failed to approve score", err)
	}

	html := `<!DOCTYPE html>
<html>
<head>
    <title>Score Approved - Cookie Banner Clicker</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 400px; margin: 100px auto; padding: 40px; text-align: center; background: #f5f5f5; }
        .success { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .icon { font-size: 64px; margin-bottom: 20px; }
        h1 { color: #28a745; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="success">
        <div class="icon">✅</div>
        <h1>Score Approved!</h1>
        <p>The leaderboard entry has been approved and is now visible on the public leaderboard.</p>
        <button onclick="window.close()" style="margin-top: 20px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
    </div>
</body>
</html>`

	return e.String(http.StatusOK, html)
}

func (h *Handlers) doDeleteScore(e *core.RequestEvent, id string) error {
	record, err := h.app.FindRecordById("leaderboard", id)
	if err != nil {
		return e.NotFoundError("Score not found", err)
	}

	if err := h.app.Delete(record); err != nil {
		return e.InternalServerError("Failed to delete score", err)
	}

	html := `<!DOCTYPE html>
<html>
<head>
    <title>Score Deleted - Cookie Banner Clicker</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 400px; margin: 100px auto; padding: 40px; text-align: center; background: #f5f5f5; }
        .success { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .icon { font-size: 64px; margin-bottom: 20px; }
        h1 { color: #dc3545; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="success">
        <div class="icon">🗑️</div>
        <h1>Score Deleted</h1>
        <p>The leaderboard entry has been permanently removed from the database.</p>
        <button onclick="window.close()" style="margin-top: 20px; padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
    </div>
</body>
</html>`

	return e.String(http.StatusOK, html)
}

func (h *Handlers) sanitizeName(name string) string {
	// Basic profanity filter
	profanityList := []string{
		"fuck", "shit", "damn", "bitch", "asshole", "bastard", "crap", "piss",
		"penis", "vagina", "sex", "nazi", "hitler", "kill", "die", "suicide",
	}

	// Remove special characters and limit length
	re := regexp.MustCompile(`[^a-zA-Z0-9\s]`)
	sanitized := re.ReplaceAllString(strings.TrimSpace(name), "")

	if len(sanitized) > 20 {
		sanitized = sanitized[:20]
	}

	sanitized = strings.TrimSpace(sanitized)

	// Replace profanity
	for _, word := range profanityList {
		re := regexp.MustCompile(`(?i)\b` + regexp.QuoteMeta(word) + `\b`)
		sanitized = re.ReplaceAllString(sanitized, strings.Repeat("*", len(word)))
	}

	// Default name if empty or too short
	if len(sanitized) < 2 {
		return "Anonymous Player"
	}

	return sanitized
}

func (h *Handlers) getTotalPlayerCount() (int, error) {
	allRecords, err := h.app.CountRecords(
		"leaderboard",
		&dbx.HashExp{"approved": true},
	)
	if err != nil {
		return 0, err
	}

	return int(allRecords), nil
}

// Signature generation and verification
func (h *Handlers) getSigningKey() string {
	key := os.Getenv("ADMIN_SIGNING_KEY")

	return key
}

func (h *Handlers) generateSignature(action, id string) string {
	key := h.getSigningKey()
	message := fmt.Sprintf("%s:%s", action, id)

	if key == "" {
		// i'd rather call no key a bad signature rather than pretend all is well
		return ""
	}

	mac := hmac.New(sha256.New, []byte(key))
	mac.Write([]byte(message))
	return hex.EncodeToString(mac.Sum(nil))
}

func (h *Handlers) verifySignature(action, id, signature string) bool {
	// blank signature is never valid
	if signature == "" {
		return false
	}

	expected := h.generateSignature(action, id)
	return hmac.Equal([]byte(expected), []byte(signature))
}
