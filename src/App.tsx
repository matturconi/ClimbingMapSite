import './App.css';
import "leaflet/dist/leaflet.css";
import logoImage from './resources/Logo11.png'
import RouteFilter from './components/RouteFilter';
import MapView from './components/MapView';

function App() {

  return (
    <div className="App">
      <div id="SiteTitle" className="row header" >
        <div id="IconDiv" className="column title" style={{ flex: 1 }}>
          <div className="iconBorder">
            <img className="image" src={logoImage} />
          </div>
        </div>
        <div id="SiteTitleDiv" className="column title text" style={{ flex: 10}}>
          Climbing Route Map Picker
        </div>
      </div>

      <div id="SiteContent" className="row">
        <RouteFilter ElementId='Something stupid'/>
        <MapView />
      </div>

      <div className="footer">
        Created by Matthew Turconi 2023
      </div>
    </div>   
  );
}

export default App;
