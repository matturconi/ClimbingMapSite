package server

import (
	"net/http"
	"strconv"

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

	api.GET("getClimbingAreas", getClimbingAreas)
	api.GET("getClimbingRoutes/:id", getClimbingRoutes)
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

func getClimbingRoutes(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Invalid Area Id",
		})
	} else {
		ret, err := database.GetRoutesByArea(id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Error getting climbing routes for chosen area.",
			})
		} else {
			// Need to spiralize the routes to add location
			c.IndentedJSON(http.StatusOK, ret)
		}
	}
}
