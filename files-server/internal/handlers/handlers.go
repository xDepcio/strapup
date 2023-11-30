package handlers

import (
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

	escapedName := strings.Replace(name, "/", "_|_", -1)

	templateStructure, err := utils.GetDirectoryStructure("./files/templates/" + escapedName)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Error parsing template structure")
	}

	return c.JSON(templateStructure)
}
