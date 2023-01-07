import { ClimbingArea } from "../classes/ClimbingArea";
import { ClimbingRoute } from "../classes/ClimbingRoute";
import { RoutesFilter } from "../classes/RoutesFilter";

const baseUrl = 'http://localhost:5000/api/';

export function GetClimbingAreas() : Promise<ClimbingArea[]> {
    return fetch(baseUrl + 'getClimbingAreas')
      .then((resp) => {
        if(!resp.ok){
            resp.json().then((dat) => {
                throw new Error(dat.message);
            })
        }
        else {
          return resp.json();
        }
      })
      .catch((error) => {
        throw error;
      });
}

export function GetClimbRoutes(areaId: number) : Promise<ClimbingRoute[]> {
    return fetch(baseUrl + 'getClimbingRoutes/' + areaId)
      .then((resp) => {
        if(!resp.ok){
            resp.json().then((dat) => {
                throw new Error(dat.message);
            })
        }
        else {
          return resp.json();
        }
      })
      .catch((error) => {
        throw error;
      });
}

export function GetFilteredAreas(areaId: number, filter: RoutesFilter) : Promise<ClimbingRoute[]> {
    return fetch(`${baseUrl}filterAreas/${filter.NumStars}/${filter.MinDiff}/${filter.MaxDiff}/${filter.ShowTR}/${filter.ShowSport}/${filter.ShowTR}`)
      .then((resp) => {
        if(!resp.ok){
            resp.json().then((dat) => {
                throw new Error(dat.message);
            })
        }
        else {
          return resp.json();
        }
      })
      .catch((error) => {
        throw error;
      });
}

export function GetFilteredRoutes(areaId: number, filter: RoutesFilter) : Promise<ClimbingRoute[]> {
    return fetch(`${baseUrl}filterRoutes/${areaId}/${filter.NumStars}/${filter.MinDiff}/${filter.MaxDiff}/${filter.ShowTR}/${filter.ShowSport}/${filter.ShowTR}`)      .then((resp) => {
        if(!resp.ok){
            resp.json().then((dat) => {
                throw new Error(dat.message);
            })
        }
        else {
          return resp.json();
        }
      })
      .catch((error) => {
        throw error;
      });
}