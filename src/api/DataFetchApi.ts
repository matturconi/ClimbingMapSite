import { ClimbingArea } from "../classes/ClimbingArea";
import { ClimbingRoute } from "../classes/ClimbingRoute";

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