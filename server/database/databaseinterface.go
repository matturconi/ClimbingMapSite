package database

import (
	"database/sql"
	"log"
	"os"
	"strconv"

	structs "climbing-map-app/server/structures"

	_ "github.com/go-sql-driver/mysql"
)

var connectionString string

func init() {
	dat, err := os.ReadFile("util\\database-creds.txt")

	if err != nil {
		log.Fatal("Could not parse database credentials.", err)
	}

	connectionString = string(dat[:]) + "@tcp(127.0.0.1:3306)/climbingroutes"
}

// Comment this
// If the aread id is <= -1, then get all areas, else its a specific area
func GetClimbingAreas(areaId int) ([]structs.ClimbingArea, error) {
	db, err := sql.Open("mysql", connectionString)
	defer db.Close()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	var areas []structs.ClimbingArea

	query := ""
	if areaId > -1 {
		query = "SELECT * FROM climbingarea where Id=" + strconv.Itoa(areaId)
	} else {
		query = "SELECT * FROM climbingarea"
	}

	res, err := db.Query(query)

	defer res.Close()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	for res.Next() {

		var area structs.ClimbingArea
		err := res.Scan(&area.Id, &area.Name, &area.Latitude, &area.Longitude, &area.RawAreaPath)

		if err != nil {
			log.Println(err)
			return nil, err
		}

		areas = append(areas, area)
	}

	return areas, nil
}

func GetRoutesByArea(areaId int) ([]structs.ClimbingRoute, error) {
	db, err := sql.Open("mysql", connectionString)
	defer db.Close()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	var routes []structs.ClimbingRoute

	query := "SELECT * FROM climbingroute WHERE LocationId=" + strconv.Itoa(areaId) + " ORDER BY Difficulty"

	res, err := db.Query(query)

	defer res.Close()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	for res.Next() {

		var route structs.ClimbingRoute
		var diffNum int
		err := res.Scan(&route.Id, &route.Name, &route.AvgStars, &route.RouteType, &diffNum, &route.Length, &route.LocationId)
		route.Difficulty = structs.CreateDifficulty(diffNum)

		if err != nil {
			log.Println(err)
			return nil, err
		}

		routes = append(routes, route)
	}

	return routes, nil
}

func GetFilteredClimbingAreas(filter structs.RouteFilter) ([]structs.ClimbingArea, error) {
	db, err := sql.Open("mysql", connectionString)
	defer db.Close()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	var areas []structs.ClimbingArea

	rows, err := db.Query("CALL filterAreas(?, ?, ?, ?, ?, ?)", filter.Stars, filter.MinDiff, filter.MaxDiff, filter.ShowTrad, filter.ShowSport, filter.ShowTR)

	for rows.Next() {
		var area structs.ClimbingArea
		err := rows.Scan(&area.Id, &area.Name, &area.Latitude, &area.Longitude, &area.RawAreaPath)

		if err != nil {
			log.Println(err)
			return nil, err
		}

		areas = append(areas, area)
	}

	return areas, err
}

func GetFilteredRoutesByArea(areaId int, filter structs.RouteFilter) ([]structs.ClimbingRoute, error) {
	db, err := sql.Open("mysql", connectionString)
	defer db.Close()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	var routes []structs.ClimbingRoute

	rows, err := db.Query("CALL filterRoutes(?, ?, ?, ?, ?, ?, ?)", areaId, filter.Stars, filter.MinDiff, filter.MaxDiff, filter.ShowTrad, filter.ShowSport, filter.ShowTR)
	defer rows.Close()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	for rows.Next() {

		var route structs.ClimbingRoute
		var diffNum int
		err := rows.Scan(&route.Id, &route.Name, &route.AvgStars, &route.RouteType, &diffNum, &route.Length, &route.LocationId)
		route.Difficulty = structs.CreateDifficulty(diffNum)

		if err != nil {
			log.Println(err)
			return nil, err
		}

		routes = append(routes, route)
	}

	return routes, nil
}
