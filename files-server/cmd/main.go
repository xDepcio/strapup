package main

import (
	"log"
	"strapup-files/internal/database"
	"strapup-files/internal/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofor-little/env"
)

func main() {
	if err := env.Load(".env"); err != nil {
		log.Fatal(err)
	}

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
