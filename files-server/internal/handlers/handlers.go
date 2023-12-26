package handlers

import (
	"database/sql"
	"fmt"
	"os"
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

type Script struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Public  bool   `json:"public"`
	OwnerID int    `json:"owner_id"`
}

func GetScriptsHandler(c *fiber.Ctx) error {
	name := c.Query("name")

	if name == "" {
		return c.Status(fiber.StatusBadRequest).SendString("Name is not specified")
	}

	row := database.DB.QueryRow("SELECT id, name, public, owner_id FROM scripts WHERE name = $1", name)

	var script Script
	err := row.Scan(&script.ID, &script.Name, &script.Public, &script.OwnerID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Error while getting scripts")
	}

	escapedName := strings.Replace(name, "/", "_-_", -1)
	if strings.Contains(escapedName, "..") {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid script name")
	}

	if script.Public {
		scriptFile, err := utils.GetTemlateFile("./files/scripts/" + escapedName + ".mjs")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString("Error getting script file")
		}
		b := []byte(scriptFile)
		return c.Send(b)
	}

	isValid, user, err := utils.Authorize(c)
	if !isValid || err != nil {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}

	if user.ID != script.OwnerID {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized - not owner")
	}

	file, err := utils.GetTemlateFile("./files/scripts/" + escapedName + ".mjs")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Error getting script file")
	}

	b := []byte(file)
	return c.Send(b)
}

type ScriptPost struct {
	Name    string   `json:"name"`
	Public  bool     `json:"isPublic"`
	Tags    []string `json:"tags"`
	Content string   `json:"content"`
}

func PostScriptsHandler(c *fiber.Ctx) error {
	type Response struct {
		Message string `json:"message"`
		Success bool   `json:"success"`
	}

	isValid, user, err := utils.Authorize(c)
	if !isValid || err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(Response{
			Message: "Unauthorized",
			Success: false,
		})
	}

	var script ScriptPost
	if err := c.BodyParser(&script); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(Response{
			Message: "Error parsing body",
			Success: false,
		})
	}

	if "@"+user.Login != strings.Split(script.Name, "/")[0] {
		return c.Status(fiber.StatusBadRequest).JSON(Response{
			Message: "Name does not match",
			Success: false,
		})
	}

	if script.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(Response{
			Message: "Name is not specified",
			Success: false,
		})
	}

	row := database.DB.QueryRow("SELECT name FROM scripts WHERE name = $1", script.Name)
	var scriptName string
	errScan := row.Scan(&scriptName)
	if errScan == nil {
		_, dbErr := database.DB.Exec("DELETE FROM scripts WHERE name=$1", script.Name)
		if dbErr != nil {
			return c.Status(fiber.StatusBadRequest).JSON(Response{
				Message: "Error while deleting old script entry",
				Success: false,
			})
		}
	} else if errScan != sql.ErrNoRows {
		return c.Status(fiber.StatusBadRequest).SendString("Error while getting scripts")
	}

	_, dbErr := database.DB.Exec("INSERT INTO scripts (name, public, owner_id) VALUES ($1, $2, $3)", script.Name, script.Public, user.ID)
	if dbErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(Response{
			Message: "Error while saving script in db",
			Success: false,
		})
	}

	escapedName := strings.Replace(script.Name, "/", "_-_", -1)
	if strings.Contains(escapedName, "..") {
		return c.Status(fiber.StatusBadRequest).JSON(Response{
			Message: "Invalid script name",
			Success: false,
		})
	}

	f, err := os.Create("./files/scripts/" + escapedName + ".mjs")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(Response{
			Message: "Error creating file",
			Success: false,
		})
	}
	defer f.Close()
	f.Write([]byte(script.Content))

	return c.JSON(Response{
		Message: "Script created",
		Success: true,
	})
}
