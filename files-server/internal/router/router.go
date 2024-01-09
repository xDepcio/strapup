package router

import (
	"strapup-files/internal/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api", logger.New())

	api.Get("/templates/structure", handlers.GetTemplateStructure)
	api.Get("/templates/file", handlers.GetFileHandler)
	api.Get("/scripts", handlers.GetScriptsHandler)
	api.Post("/scripts", handlers.PostScriptsHandler)
	api.Post("/templates", handlers.PostTemplatesHandler)
}
