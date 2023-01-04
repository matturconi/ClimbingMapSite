import React, {useState, useEffect} from 'react';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import './App.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { ClimbingArea } from './classes/ClimbingArea';
import { GetClimbingAreas, GetClimbRoutes } from './api/DataFetchApi';

function App() {
  const [climbingAreas, setClimbingAreas] = useState<ClimbingArea[]>();

  const lIcon = (new Icon({iconUrl: markerIconPng}));

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = () => {
    GetClimbingAreas().then((data) => {
      setClimbingAreas(data);
    }).catch((error) => {
      console.log("Error getting Climbing Areas", error)
    })
  }

  const fetchRoutes = (areaId: number) => {
    GetClimbRoutes(areaId).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.log("Error getting routes for Area", error)
    })
  }

  const getAreaMarkers = () => {
    let markers: JSX.Element[] = [];
    climbingAreas?.forEach((area) => {
      markers.push(
        <Marker icon={lIcon} position={[area.Latitude,area.Longitude]} eventHandlers={{
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
      <MapContainer 
        center={[43.802, -71.837]} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '600px', width: "750px" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        {climbingAreas != null && getAreaMarkers()}

      </MapContainer>
    </div>   
  );
}

export default App;
