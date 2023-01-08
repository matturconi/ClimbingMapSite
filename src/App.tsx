import './App.css';
import "leaflet/dist/leaflet.css";
import logoImage from './resources/Logo11.png'
import RouteFilter from './components/RouteFilter';
import MapView from './components/MapView';
import { useState } from 'react';
import { ClimbingArea } from './classes/ClimbingArea';
import { RoutesFilter } from './classes/RoutesFilter';
import { GetFilteredAreas } from './api/DataFetchApi';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#654ca9"
    }
  }
});

function App() {
  const [climbingAreas, setClimbingAreas] = useState<ClimbingArea[]>();
  // Copy of the filter for the map view to use - will always be valid
  const [mapFilterCopy, setMapFilterCopy] = useState<RoutesFilter>(new RoutesFilter());

  const FilterClimbingAreas = (filter: RoutesFilter) => {
    GetFilteredAreas(filter).then((data) => {
      setMapFilterCopy(filter);
      setClimbingAreas(data);
    }).catch((error) => {
      console.log("Error getting Filtered Areas", error)
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div id="SiteTitle" className="row header" >
          <div id="IconDiv" className="column title" style={{ flex: 1 }}>
            <div className="iconBorder">
              <img className="image" title="Created using OpenAI Dall-E-2" src={logoImage} alt={"Site Icon"} />
            </div>
          </div>
          <div id="SiteTitleDiv" className="column title text" style={{ flex: 10 }}>
            Climbing Route Map Picker
          </div>
        </div>

        <div id="SiteContent" className="row">
          <RouteFilter FilterAreas={FilterClimbingAreas} />
          <MapView RouteFilter={mapFilterCopy} ClimbingAreas={climbingAreas} SetClimbingAreas={setClimbingAreas} />
        </div>

        <div className="footer">
          Created by Matthew Turconi 2023
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
