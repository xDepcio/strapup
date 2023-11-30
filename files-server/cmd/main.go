package main

import (
	"log"
	"strapup-files/internal/database"
	"strapup-files/internal/router"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	router.SetupRoutes(app)

	if err := database.Connect(); err != nil {
		log.Fatal(err)
	}

	app.Listen(":5000")
}
