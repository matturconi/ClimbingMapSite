package main

import (
	"climbing-map-app/server"

	"github.com/gin-gonic/contrib/cors"
	"github.com/gin-gonic/gin"
)

var router *gin.Engine

func main() {
	// Set the router as the default one provided by Gin
	router = gin.Default()
	//Needed for hot reloading to work
	router.Use(cors.Default())

	// Init the routes
	server.InitializeRoutes(router)

	// Start and run the server
	router.Run(":5000")
}
