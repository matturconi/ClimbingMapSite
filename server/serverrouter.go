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
	api.GET("filterAreas/:stars/:minDiff/:maxDiff/:showTrad/:showSport/:showTR", filterAreas)
	api.GET("filterRoutes/:locid/:stars/:minDiff/:maxDiff/:showTrad/:showSport/:showTR", filterRoutes)
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

func filterAreas(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	// Get params and check for parsing errors
	hasErr := false
	var filter structures.RouteFilter
	var err error
	filter.Stars, err = strconv.Atoi(c.Param("stars"))
	hasErr = hasErr || err != nil
	filter.MinDiff, err = strconv.Atoi(c.Param("minDiff"))
	hasErr = hasErr || err != nil
	filter.MaxDiff, err = strconv.Atoi(c.Param("maxDiff"))
	hasErr = hasErr || err != nil
	filter.ShowTrad, err = strconv.ParseBool(c.Param("showTrad"))
	hasErr = hasErr || err != nil
	filter.ShowSport, err = strconv.ParseBool(c.Param("showSport"))
	hasErr = hasErr || err != nil
	filter.ShowTR, err = strconv.ParseBool(c.Param("showTR"))
	hasErr = hasErr || err != nil
	// If error return error message
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Error parsing filter parameters.",
		})
	} else {
		var areas []structures.ClimbingArea
		areas, err = database.GetFilteredClimbingAreas(filter)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Error fetching filtered areas.",
			})
		} else {
			c.IndentedJSON(http.StatusOK, areas)
		}
	}
}

func filterRoutes(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	// Get params and check for parsing errors
	hasErr := false
	var filter structures.RouteFilter
	locId, err := strconv.Atoi(c.Param("locid"))
	hasErr = hasErr || err != nil
	filter.Stars, err = strconv.Atoi(c.Param("stars"))
	hasErr = hasErr || err != nil
	filter.MinDiff, err = strconv.Atoi(c.Param("minDiff"))
	hasErr = hasErr || err != nil
	filter.MaxDiff, err = strconv.Atoi(c.Param("maxDiff"))
	hasErr = hasErr || err != nil
	filter.ShowTrad, err = strconv.ParseBool(c.Param("showTrad"))
	hasErr = hasErr || err != nil
	filter.ShowSport, err = strconv.ParseBool(c.Param("showSport"))
	hasErr = hasErr || err != nil
	filter.ShowTR, err = strconv.ParseBool(c.Param("showTR"))
	hasErr = hasErr || err != nil
	// If error return error message
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Error parsing filter parameters.",
		})
	} else {
		// Get the area by id so for its lat long
		area, err := database.GetClimbingAreas(locId)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Error finding climbing area.",
			})
		}

		var routes []structures.ClimbingRoute
		routes, err = database.GetFilteredRoutesByArea(locId, filter)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Error fetching filtered Routes.",
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
