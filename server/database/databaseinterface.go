package database

import (
	"database/sql"
	"log"
	"os"
	"strconv"

	structs "climbing-map-app/server/structures"

	_ "github.com/go-sql-driver/mysql"
)

func GetClimbingAreas() ([]structs.ClimbingArea, error) {

	var areas []structs.ClimbingArea

	dat, err := os.ReadFile("util\\database-creds.txt")

	if err != nil {
		log.Println(err)
		return nil, err
	}

	db, err := sql.Open("mysql", string(dat[:])+"@tcp(127.0.0.1:3306)/climbingroutes")
	defer db.Close()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	res, err := db.Query("SELECT * FROM climbingarea")

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

	var routes []structs.ClimbingRoute

	dat, err := os.ReadFile("util\\database-creds.txt")

	if err != nil {
		log.Println(err)
		return nil, err
	}

	db, err := sql.Open("mysql", string(dat[:])+"@tcp(127.0.0.1:3306)/climbingroutes")
	defer db.Close()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	query := "SELECT * FROM climbingroute WHERE LocationId=" + strconv.Itoa(areaId)

	res, err := db.Query(query)

	defer res.Close()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	for res.Next() {

		var route structs.ClimbingRoute
		err := res.Scan(&route.Id, &route.Name, &route.AvgStars, &route.RouteType, &route.Difficulty, &route.Length, &route.LocationId)

		if err != nil {
			log.Println(err)
			return nil, err
		}

		routes = append(routes, route)
	}

	return routes, nil
}
