package structures

import (
	"database/sql"
)

var difficulties = []string{"3rd", "4th", "5", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10a", "5.10b", "5.10",
	"5.10c", "5.10d", "5.11a", "5.11b", "5.11", "5.11c", "5.11d", "5.12a", "5.12b", "5.12", "5.12c", "5.12d", "5.13a", "5.13b", "5.13",
	"5.13c", "5.13d", "5.14a", "5.14b", "5.14", "5.14c", "5.14d", "5.15a", "5.15b", "5.15", "5.15c", "5.15d"}

type ClimbingRoute struct {
	Id         int
	Name       string
	AvgStars   float32
	RouteType  string
	Difficulty Difficulty
	Length     sql.NullInt32
	LocationId int
	Latitude   float64
	Longitude  float64
}

type Difficulty struct {
	RouteGrade string
	Id         int
}

func CreateDifficulty(num int) Difficulty {
	return Difficulty{RouteGrade: difficulties[num], Id: num}
}
