import { ClimbingArea } from "../classes/ClimbingArea";
import { ClimbingRoute } from "../classes/ClimbingRoute";
import { RoutesFilter } from "../classes/RoutesFilter";
import { DifficultyLst } from "../util/Constants";

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

export function GetFilteredAreas(filter: RoutesFilter) : Promise<ClimbingArea[]> {
    let minDiff = filter.MinDiff === '' ? 0 : DifficultyLst.indexOf(filter.MinDiff);
    let maxDiff = filter.MaxDiff === '' ? DifficultyLst.length - 1 : DifficultyLst.indexOf(filter.MaxDiff);
    return fetch(`${baseUrl}filterAreas/${filter.NumStars}/${minDiff}/${maxDiff}/${filter.ShowTrad}/${filter.ShowSport}/${filter.ShowTR}`)
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
    let minDiff = filter.MinDiff === '' ? 0 : DifficultyLst.indexOf(filter.MinDiff);
    let maxDiff = filter.MaxDiff === '' ? DifficultyLst.length - 1 : DifficultyLst.indexOf(filter.MaxDiff);    
    return fetch(`${baseUrl}filterRoutes/${areaId}/${filter.NumStars}/${minDiff}/${maxDiff}/${filter.ShowTrad}/${filter.ShowSport}/${filter.ShowTR}`) 
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