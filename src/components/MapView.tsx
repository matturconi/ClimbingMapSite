import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import {useState, useEffect} from 'react';
import { ClimbingArea } from '../classes/ClimbingArea';
import { GetClimbingAreas, GetClimbRoutes } from '../api/DataFetchApi';
import { ClimbingRoute } from '../classes/ClimbingRoute';
import { renderToStaticMarkup } from "react-dom/server"
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon, divIcon} from 'leaflet'

interface IMapViewProps {
    
}

const MapView: React.FC<IMapViewProps> = (props: IMapViewProps) => {
    const [climbingAreas, setClimbingAreas] = useState<ClimbingArea[]>();
    const [climbingRoutes, setClimbingRoutes] = useState<ClimbingRoute[]>();
    const [selecteAreaId, setSelecteAreadId] = useState<number>(-1);

    const lIcon = (new Icon({iconUrl: markerIconPng}));

    const ic = (diff: string, delay: number) => { return (
      <div className="routeCircle" style={{animationDelay: delay+"ms"}}>
        <div style={{
          position: "absolute",
          top: "55%",
          left: "40%",
          fontSize: "10px",
          color: "black"        
        }}>
          {diff}
        </div>
      </div>
    )}

    useEffect(() => {
        fetchAreas();
      }, []);

    const fetchAreas = () => {
        GetClimbingAreas().then((data) => {
          setClimbingAreas(data);
        }).catch((error) => {
          console.log("Error getting Climbing Areas", error)
        });
      }
    
      const fetchRoutes = (areaId: number) => {
        if(areaId === selecteAreaId){
          setSelecteAreadId(-1)
          setClimbingRoutes(undefined)
        }
        else{
          setSelecteAreadId(areaId)
          GetClimbRoutes(areaId).then((data) => {
            console.log(data)
            setClimbingRoutes(data);
          }).catch((error) => {
            console.log("Error getting routes for Area", error)
          });
        }
      }
    
      const getRouteMarkers = () => {
        let markers: JSX.Element[] = [];
        if (climbingRoutes !== undefined) {
          let interval = 500 / climbingRoutes?.length;
          let delay = interval;
          climbingRoutes?.forEach((route) => {
            let routeIcon = divIcon({
              html: renderToStaticMarkup(ic(route.Difficulty.RouteGrade, delay)),
              className: "routeIcon"
            })
            markers.push(
                <Marker key={route.Name} zIndexOffset={100} icon={routeIcon} position={[route.Latitude, route.Longitude]} >
                  <Tooltip offset={[0,15]} direction='left'>
                    {route.Name}
                    <br/>
                    {route.Difficulty.RouteGrade}
                  </Tooltip>
                </Marker>
            );
            delay += interval;
          })
        }
    
        return markers;
      }
    
      const getAreaMarkers = () => {
        let markers: JSX.Element[] = [];
        climbingAreas?.forEach((area) => {
          markers.push(
            <Marker key={area.Name} icon={lIcon} position={[area.Latitude,area.Longitude]} opacity={selecteAreaId != -1 && area.Id != selecteAreaId ? 0.5 : 1.0 } eventHandlers={{
              click: (e) => {
                fetchRoutes(area.Id);
              },
            }}>
              <Tooltip offset={[0,15]} direction='left'>
                {area.Name}
              </Tooltip>
            </Marker>
          );
        })
    
        return markers;
      }

    return (
        <div id="MapContent" className="column" style={{flex: 4, paddingTop: "4px"}}>
          <MapContainer 
            center={[43.802, -71.837]} 
            zoom={15} 
            scrollWheelZoom={true} 
            style={{ height: "677px", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            {climbingAreas != null && getAreaMarkers()}
            {climbingRoutes != null && getRouteMarkers()}
          </MapContainer>
        </div>
    )
}

export default MapView;