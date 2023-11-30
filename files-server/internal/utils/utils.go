package utils

import (
	"os"
	"path/filepath"

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

func AuthUser(c *fiber.Ctx) {

}
