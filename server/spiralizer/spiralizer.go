package spiralizer

import (
	"math"

	"climbing-map-app/server/structures"
)

var XScale float64 = 0.0001
var YScale float64 = 0.00013
var k float64 = 9.0

func CreateSpiralPointsAtOrigin(origin structures.Point, num int) []structures.Point {
	var points []structures.Point

	r := 1.0
	for n := 0; n < num; n++ {
		var point structures.Point
		theta := math.Sqrt(float64(n) * k)
		point.X = r * theta * math.Cos(theta)
		point.Y = r * theta * math.Sin(theta)
		// Scale the points down to fit on the map
		point.X *= XScale
		point.Y *= YScale
		// Need to add the base point to each point, as the current point serves as the offset
		point.X += origin.X
		point.Y += origin.Y

		points = append(points, point)
	}
	return points
}
