package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strapup-files/internal/database"

	"github.com/gofiber/fiber/v2"
)

type FileNode struct {
	Name     string
	IsDir    bool
	Children []FileNode
}

func GetDirectoryStructure(rootPath string) (FileNode, error) {
	var result FileNode
	result.Name = filepath.Base(rootPath)
	result.IsDir = true

	err := filepath.Walk(rootPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if path == rootPath {
			return nil
		}

		node := FileNode{
			Name:  info.Name(),
			IsDir: info.IsDir(),
		}

		if info.IsDir() {
			children, err := GetDirectoryStructure(path)
			if err != nil {
				return err
			}
			node.Children = append(node.Children, children)
		}

		result.Children = append(result.Children, node)

		return nil
	})

	if err != nil {
		return FileNode{}, err
	}

	return result, nil
}

// type GithubUserData struct {
// 	GithubID int `json:"github_id"`
// }

func Authorize(c *fiber.Ctx) (bool, User, error) {
	token := c.Get("Authorization")
	if token == "" {
		return false, User{}, fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	// Specify the GitHub API endpoint you want to access
	apiURL := "https://api.github.com/user"

	// Create an HTTP client with the authorization header
	client := &http.Client{}
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return false, User{}, err
	}
	req.Header.Set("Authorization", "Bearer "+token)

	// Make the request
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return false, User{}, err
	}
	defer resp.Body.Close()

	// Check the HTTP status code
	// if resp.StatusCode != http.StatusOK {
	// 	fmt.Println("Error:", resp.Status)
	// 	return User{}, err
	// }

	// Decode the JSON response
	var data map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		fmt.Println("Error decoding JSON:", err)
		return false, User{}, err
	}

	// Check if the response contains certain values
	// if value, ok := data["id"]; ok && value {
	// 	fmt.Println("Value:", value)
	// } else {
	// 	fmt.Println("Key 'some_key' not found in the response.")
	// }

	// You can add more checks based on your specific requirements

	// Print the entire response for reference
	fmt.Println("Response:", data)

	userGithubID := int(data["id"].(float64))
	user, err := DbGetUserByGithubID(userGithubID)
	if err != nil {
		return false, User{}, err
	}

	return true, user, nil
}

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Login    string `json:"login"`
	GithubID int    `json:"github_id"`
}

func DbGetUserByGithubID(githubID int) (User, error) {
	row := database.DB.QueryRow("SELECT id FROM users WHERE github_id = $1", githubID)

	var user User
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Login, &user.GithubID)
	if err != nil {
		return User{}, err
	}

	return user, nil
}
