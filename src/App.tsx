import React, {useState} from 'react';
import L from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import './App.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';

function App() {
  const [msg, setMsg] = useState<string>("Default Msg");

  const lIcon = (new Icon({iconUrl: markerIconPng}));

  const fetchMsg = () => {
    fetch('http://localhost:5000/api/fetchedMsg')
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setMsg(data.message);
      })
      .catch((err) => {
        console.log(err.message);
        setMsg("There was an error");
      });
  }

  return (
    <div className="App">
      <button onClick={fetchMsg}>Click Me First</button>
      <div>
        {msg}
      </div>

      <MapContainer 
        center={[43.802, -71.837]} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '600px', width: "750px" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        <Marker icon={lIcon} position={[43.80527,-71.84431]}>
          <Popup>
            The Asylum 1
          </Popup>
        </Marker>
        <Marker icon={lIcon} position={[43.80263,-71.83398]}>
          <Popup>
            The G-Spot
          </Popup>
        </Marker>        
        <Marker icon={lIcon} position={[43.80513,-71.84452]}>
          <Popup>
            Prudential
          </Popup>
        </Marker>
        <Marker icon={lIcon} position={[43.80386,-71.84091]}>
          <Popup>
            Wimea
          </Popup>
        </Marker>

      </MapContainer>
    </div>   
  );
}

export default App;
