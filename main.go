package main

import (
	_ "cookie-banner-clicker/migrations"
	"embed"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	_ "github.com/joho/godotenv/autoload"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

//go:embed all:dist
var distFS embed.FS

func main() {
	app := pocketbase.New()

	// Check if running with "go run" for development
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	// Enable auto-migrations during development
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: isGoRun,
	})

	// Configure CORS and static file serving
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// Add CORS middleware
		se.Router.BindFunc(func(e *core.RequestEvent) error {
			// Allow requests from localhost during development
			allowedOrigins := []string{
				"http://localhost:3000",
				"http://localhost:5173",
				"http://localhost:8090",
			}

			origin := e.Request.Header.Get("Origin")
			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin {
					e.Response.Header().Set("Access-Control-Allow-Origin", origin)
					break
				}
			}

			e.Response.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			e.Response.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			e.Response.Header().Set("Access-Control-Max-Age", "86400")

			// Handle preflight requests
			if e.Request.Method == "OPTIONS" {
				return e.NoContent(204)
			}

			return e.Next()
		})

		return se.Next()
	})

	// Configure frontend serving and API routes
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// Extract the dist subdirectory from embedded filesystem
		distSubFS, err := fs.Sub(distFS, "dist")
		if err != nil {
			return err
		}

		// Serve the main app at root
		se.Router.GET("/", func(e *core.RequestEvent) error {
			file, err := distSubFS.Open("index.html")
			if err != nil {
				return e.NotFoundError("File not found", err)
			}
			defer file.Close()

			content, err := io.ReadAll(file)
			if err != nil {
				return e.InternalServerError("Failed to read file", err)
			}

			e.Response.Header().Set("Content-Type", "text/html")
			e.Response.Write(content)
			return nil
		})

		// Serve static assets
		se.Router.GET("/assets/{path...}", func(e *core.RequestEvent) error {
			fileServer := http.FileServer(http.FS(distSubFS))
			fileServer.ServeHTTP(e.Response, e.Request)
			return nil
		})

		// Setup API routes
		h := NewHandlers(app)
		h.RegisterRoutes(se)

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
