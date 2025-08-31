package main

import (
	"fmt"
	"log"
	"net/mail"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/mailer"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type EmailService struct {
	app *pocketbase.PocketBase
}

type SignatureGenerator interface {
	generateSignature(action, id string) string
}

func NewEmailService(app *pocketbase.PocketBase) *EmailService {
	return &EmailService{
		app: app,
	}
}

func (e *EmailService) SendModerationEmail(id, name string, score int, levelsCompleted int, _ string, isNew bool, signer SignatureGenerator) error {
	// Get admin email from app settings
	var admins []*core.Record

	err := e.app.RecordQuery(core.CollectionNameSuperusers).All(&admins)

	if err != nil {
		log.Fatalf("failed to fetch admins: %v", err)
	}

	var email = ""
	for _, rec := range admins {
		email = rec.GetString("email")
		log.Printf("admin email: %s", email)
	}

	if len(email) == 0 {
		return fmt.Errorf("no admin emails configured")
	}

	action := "updated"
	if isNew {
		action = "submitted"
	}

	// Generate signed URLs
	approveSignature := signer.generateSignature("approve", id)
	deleteSignature := signer.generateSignature("delete", id)

	baseURL := e.app.Settings().Meta.AppURL
	if baseURL == "" {
		baseURL = "http://localhost:8080" // Default for development
	}

	approveURL := fmt.Sprintf("%s/admin/approve/%s/%s", baseURL, id, approveSignature)
	deleteURL := fmt.Sprintf("%s/admin/delete/%s/%s", baseURL, id, deleteSignature)

	subject := fmt.Sprintf("Cookie Banner Clicker - New Score %s", cases.Title(language.English).String(action))

	body := fmt.Sprintf(`A new leaderboard score has been %s and requires moderation:

Player Name: %s
Score: %d
Levels Completed: %d
Action: %s

Quick Actions:
• ✅ Approve: %s
• 🗑️ Delete: %s

These links are secure and can only be used by authorized administrators.

Best regards,
Cookie Banner Clicker Moderation System`, action, name, score, levelsCompleted, action, approveURL, deleteURL)

	// Use PocketBase's built-in mailer
	message := &mailer.Message{
		From: mail.Address{
			Address: e.app.Settings().Meta.SenderAddress,
			Name:    e.app.Settings().Meta.SenderName,
		},
		To:      []mail.Address{{Address: email}},
		Subject: subject,
		Text:    body,
	}

	return e.app.NewMailClient().Send(message)
}
