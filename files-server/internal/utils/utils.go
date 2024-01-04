package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strapup-files/internal/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofor-little/env"
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

func GetTemlateFile(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}

	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return "", err
	}

	var result string
	buf := make([]byte, stat.Size())
	count, err := file.Read(buf)
	if err != nil {
		return "", err
	}
	fmt.Println(count, buf[:count])
	result += string(buf[:count])
	fmt.Println(result)
	// for {
	// 	n, err := file.Read(buf)
	// 	if err != nil {
	// 		return "", err
	// 	}

	// 	result += string(buf[:n])

	// 	if n == 0 {
	// 		break
	// 	}
	// }
	return result, nil

	// return result, nil
}

// type GithubUserData struct {
// 	GithubID int `json:"github_id"`
// }

func Authorize(c *fiber.Ctx) (bool, bool, User, error) {
	token := c.Get("Authorization")
	if token == "" {
		return false, false, User{}, fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	root_key, err := env.MustGet("API_ROOT_KEY")
	if err != nil {
		return false, false, User{}, err
	}
	if root_key == token {
		return true, true, User{}, nil
	}

	// Specify the GitHub API endpoint you want to access
	apiURL := "https://api.github.com/user"

	// Create an HTTP client with the authorization header
	client := &http.Client{}
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return false, false, User{}, err
	}
	req.Header.Set("Authorization", "Bearer "+token)

	// Make the request
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return false, false, User{}, err
	}
	defer resp.Body.Close()

	// Check the HTTP status code
	// if resp.StatusCode != http.StatusOK {
	// 	fmt.Println("Error:", resp.Status)
	// 	return User{}, err
	// }

	// Decode the JSON response
	data := struct {
		Id int `json:"id"`
	}{
		Id: 0,
	}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		fmt.Println("Error decoding JSON:", err)
		return false, false, User{}, err
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

	userGithubID := int(data.Id)
	user, err := DbGetUserByGithubID(userGithubID)
	if err != nil {
		return false, false, User{}, err
	}

	return true, false, user, nil
}

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Login    string `json:"login"`
	GithubID int    `json:"github_id"`
}

func DbGetUserByGithubID(githubID int) (User, error) {
	row := database.DB.QueryRow("SELECT id, name, email, login, github_id FROM users WHERE github_id = $1", githubID)

	var user User
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Login, &user.GithubID)
	if err != nil {
		fmt.Println("Error while getting user by github id")
		return User{}, err
	}

	return user, nil
}
