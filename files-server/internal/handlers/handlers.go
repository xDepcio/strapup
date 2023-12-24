package handlers

import (
	"fmt"
	"strapup-files/internal/database"
	"strapup-files/internal/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type Template struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Public  bool   `json:"public"`
	OwnerID int    `json:"owner_id"`
}

func GetTemplateStructure(c *fiber.Ctx) error {
	name := c.Query("name")
	if name == "" {
		return c.Status(fiber.StatusBadRequest).SendString("Name is not specified")
	}

	row := database.DB.QueryRow("SELECT id, name, public, owner_id FROM templates WHERE name = $1", name)

	var template Template
	err := row.Scan(&template.ID, &template.Name, &template.Public, &template.OwnerID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Error while getting templates")
	}

	escapedName := strings.Replace(name, "/", "_-_", -1)
	if strings.Contains(escapedName, "..") {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid template name")
	}

	if template.Public {
		templateStructure, err := utils.GetDirectoryStructure("./files/templates/" + escapedName)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString("Error parsing template structure")
		}

		return c.JSON(templateStructure)
	}

	isValid, user, err := utils.Authorize(c)
	if !isValid || err != nil {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}

	if user.ID != template.OwnerID {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}

	fmt.Println(user)

	templateStructure, err := utils.GetDirectoryStructure("./files/templates/" + escapedName)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Error parsing private template structure")
	}

	return c.JSON(templateStructure)
}

func GetFileHandler(c *fiber.Ctx) error {
	name := c.Query("name")

	fmt.Println(1)
	if name == "" {
		return c.Status(fiber.StatusBadRequest).SendString("Name is not specified")
	}

	var topNameArr = [2]string{strings.Split(name, "/")[0], strings.Split(name, "/")[1]}
	topName := topNameArr[0] + "/" + topNameArr[1]
	row := database.DB.QueryRow("SELECT id, name, public, owner_id FROM templates WHERE name = $1", topName)
	fmt.Println(2)

	var template Template
	err := row.Scan(&template.ID, &template.Name, &template.Public, &template.OwnerID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Error while getting templates")
	}
	fmt.Println(3)

	escapedName := strings.Replace(name, "/", "_-_", 1)
	if strings.Contains(escapedName, "..") {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid template name")
	}

	fmt.Println(escapedName)
	if template.Public {
		file, err := utils.GetTemlateFile("./files/templates/" + escapedName)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString("Error getting template file")
		}
		b := []byte(file)
		return c.Send(b)
	}

	isValid, user, err := utils.Authorize(c)
	if !isValid || err != nil {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}

	if user.ID != template.OwnerID {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized - not owner")
	}

	file, err := utils.GetTemlateFile("./files/templates/" + escapedName)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Error getting template file")
	}

	b := []byte(file)
	return c.Send(b)
}
