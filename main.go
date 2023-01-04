package main

import (
	"climbing-map-app/server"
	"fmt"

	"github.com/gin-gonic/gin"
)

var router *gin.Engine

func main() {
	// Set the router as the default one provided by Gin
	router = gin.Default()
	if router == nil {
		fmt.Println("was nil")
	}
	// Init the routes
	server.InitializeRoutes(router)

	// Start and run the server
	router.Run(":5000")
}
