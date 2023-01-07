package spiralizer

import (
	"math"

	"climbing-map-app/server/structures"
)

var XScale float64 = 0.0002
var YScale float64 = 0.00025

func CreateSpiralPointsAtOrigin(origin structures.Point, num int) []structures.Point {
	var points []structures.Point
	var x = 3.0
	var interval float64 = (math.Pi / x)
	var theta float64 = interval
	for i := 0; i < num; i++ {
		var point structures.Point
		// Use formula r = a * theta
		point.X = theta
		point.Y = point.X // Use a = 1 in this case as we need to scale it later anyway
		point = convertPolarToCartesian(point, true)
		// Need to add the base point to each point, as the current point serves as the offset
		point.X += origin.X
		point.Y += origin.Y
		// Add it to return list
		points = append(points, point)
		// Every so many Pi Rotations decrease the interval so the points are less spaced out
		if i%int(x) == 0 {
			x += 1
			interval = (math.Pi / x)
		}
		theta += interval
	}

	return points
}

func convertPolarToCartesian(polar structures.Point, useScale bool) structures.Point {
	var p structures.Point
	p.X = polar.X * math.Cos(polar.Y)
	p.Y = polar.X * math.Sin(polar.Y)
	// If we shouls scale the value up or down based on the Global Scale variable
	if useScale {
		p.X *= XScale
		p.Y *= YScale
	}
	return p
}

// func genEqualChoords(num int) []Point {
// 	var points []Point
// 	var k = 2.0
// 	r := 1.0
// 	for n := 0; n < num; n++ {
// 		var point Point
// 		theta := math.Sqrt(float64(n) * k)
// 		point.a = r * theta * math.Cos(theta)
// 		point.b = r * theta * math.Sin(theta)
// 		points = append(points, point)
// 	}
// 	return points
// }

// func generateSpiralCoords(num int, a float64) []Point {
// 	var points []Point

// 	var interval float64 = (math.Pi / 5)
// 	for i := 1; i < num; i++ {
// 		var point Point
// 		point.a = interval * float64(i)
// 		point.b = a * point.a
// 		point = convertPolarToCart(point)
// 		points = append(points, point)
// 	}

// 	return points
// }
