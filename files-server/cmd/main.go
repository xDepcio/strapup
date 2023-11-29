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

	db, err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// rows, err := db.Query("SELECT name, email, login FROM users")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer rows.Close()

	// fmt.Println(rows)
	// for rows.Next() {
	// 	var name string
	// 	var email string
	// 	var login string
	// 	if err := rows.Scan(&name, &email, &login); err != nil {
	// 		log.Fatal(err)
	// 	}
	// 	fmt.Printf("Name: %s, Email: %s, Login: %s\n", name, email, login)
	// }

	log.Fatal(app.Listen(":3000"))
}
