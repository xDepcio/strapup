package main

import (
	"log"
	database "strapup-files/internal"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	if err := database.Connect(); err != nil {
		log.Fatal(err)
	}

	log.Fatal(app.Listen(":3000"))
}
