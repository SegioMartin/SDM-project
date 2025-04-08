package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"fmt"
)

func main() {
	router := gin.Default()
	fmt.Print("wtfffffffffffffffff")

	router.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello World!")
	})

	router.Run("0.0.0.0:8080") // Запуск сервера на localhost:8080
}