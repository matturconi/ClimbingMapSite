package server

import (
	"net/http"
	"strconv"

	"climbing-map-app/server/database"
	"climbing-map-app/server/spiralizer"
	"climbing-map-app/server/structures"

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
	ret, err := database.GetClimbingAreas(-1)
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
		// Get the area by id so for its lat long
		area, err := database.GetClimbingAreas(id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Error finding climbing area.",
			})
		}
		// Get the routes for the valid area
		routes, err := database.GetRoutesByArea(id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Error getting climbing routes for chosen area.",
			})
		} else {
			// Need to spiralize the routes to give them a location based on the area origin
			var origin structures.Point
			origin.X = float64(area[0].Latitude)
			origin.Y = float64(area[0].Longitude)

			spiralPoints := spiralizer.CreateSpiralPointsAtOrigin(origin, len(routes)+1)
			spiralPoints = spiralPoints[1:]

			for i := 0; i < len(spiralPoints); i++ {
				routes[i].Latitude = spiralPoints[i].X
				routes[i].Longitude = spiralPoints[i].Y
			}

			c.IndentedJSON(http.StatusOK, routes)
		}
	}
}
