import { ClimbingArea } from "../classes/ClimbingArea";

const baseUrl = 'http://localhost:5000/api/';

export function GetClimbingAreas() : Promise<ClimbingArea[]> {
    return fetch(baseUrl + 'getClimbingAreas')
      .then((resp) => {
        if(!resp.ok){
            resp.json().then((dat) => {
                throw new Error(dat.message)
            })
        }
        else {
          return resp.json();
        }
      })
      .catch((error) => {
        throw error
      });
}