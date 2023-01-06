import {useState, useEffect} from 'react';
import { renderToStaticMarkup } from "react-dom/server"
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon, divIcon} from 'leaflet'
import './App.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Tooltip, SVGOverlay, Circle } from 'react-leaflet';
import { ClimbingArea } from './classes/ClimbingArea';
import { GetClimbingAreas, GetClimbRoutes } from './api/DataFetchApi';
import { ClimbingRoute } from './classes/ClimbingRoute';
import logoImage from './resources/Logo11.png'

function App() {
  const [climbingAreas, setClimbingAreas] = useState<ClimbingArea[]>();
  const [climbingRoutes, setClimbingRoutes] = useState<ClimbingRoute[]>();
  const [selecteAreaId, setSelecteAreadId] = useState<number>(-1);

  const lIcon = (new Icon({iconUrl: markerIconPng}));

 
  const ic = (diff: string) => { return (
    <div className="routeCircle">
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
    climbingRoutes?.forEach((route) => {
      let routeIcon = divIcon({
        html: renderToStaticMarkup(ic(route.Difficulty)),
        className: "routeIcon"
      })
      markers.push(
        <Marker zIndexOffset={100} icon={routeIcon} position={[route.Latitude, route.Longitude]} >
          <Tooltip offset={[0,15]} direction='left'>
            {route.Name}
            <br/>
            {route.Difficulty}
          </Tooltip>
        </Marker>
      );
    })

    return markers;
  }

  const getAreaMarkers = () => {
    let markers: JSX.Element[] = [];
    climbingAreas?.forEach((area) => {
      markers.push(
        <Marker icon={lIcon} position={[area.Latitude,area.Longitude]} opacity={selecteAreaId != -1 && area.Id != selecteAreaId ? 0.5 : 1.0 } eventHandlers={{
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
    <div className="App">
      <div id="SiteTitle" className="row header" >
        <div id="IconDiv" className="column title" style={{ flex: 1 }}>
          <img className="image" src={logoImage} />
        </div>
        <div id="SiteTitleDiv" className="column title text" style={{ flex: 10}}>
          Climbing Route Map Picker
        </div>
      </div>

      <div id="SiteContent" className="row">

        <div id="SiteFilterContent" className="column" >
          This will eventually be a filter
        </div>
        <div id="MapContent" className="column" style={{flex: 3, paddingTop: "4px"}}>
          <MapContainer 
            center={[43.802, -71.837]} 
            zoom={15} 
            scrollWheelZoom={true} 
            style={{ height: "684px", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            {climbingAreas != null && getAreaMarkers()}
            {climbingRoutes != null && getRouteMarkers()}
          </MapContainer>
        </div>
      </div>

      <div className="footer">
        Created by Matthew Turconi 2023
      </div>
    </div>   
  );
}

export default App;
