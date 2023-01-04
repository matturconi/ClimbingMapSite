package server

import (
	"net/http"

	"climbing-map-app/server/database"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func InitializeRoutes(router *gin.Engine) {
	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./build", true)))

	// Setup route group for the API
	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "ping ",
			})
		})
	}

	api.GET("fetchedMsg", getFetchedMsg)
	api.GET("getClimbingAreas", getClimbingAreas)
}

func getFetchedMsg(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"message": "This is a message that we fetched form the gin.",
	})
}

func getClimbingAreas(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	ret, err := database.GetClimbingAreas()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Error getting climbing areas.",
		})
	} else {
		c.IndentedJSON(http.StatusOK, ret)
	}

}
