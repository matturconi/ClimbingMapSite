export class ClimbingRoute {
    Id: number = 0;
    Name: string = '';
    AvgStars: number = 0;
    RouteType: string = '';
    Difficulty: Difficulty = new Difficulty();
    Length: {Int32: number; Valid: boolean} = {Int32: 0, Valid: false};
    LocationId: number = 0;
    Latitude: number = 0;
    Longitude: number = 0;
}

export class Difficulty {
    RouteGrade: string = '';
	Id: number = -1;
}