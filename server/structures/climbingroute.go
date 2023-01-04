package structures

import (
	"database/sql"
)

type ClimbingRoute struct {
	Id         int
	Name       string
	AvgStars   float32
	RouteType  string
	Difficulty string
	Length     sql.NullInt32
	LocationId int
}
