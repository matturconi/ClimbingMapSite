import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { ClimbingArea } from '../classes/ClimbingArea';
import { GetClimbingAreas, GetFilteredRoutes } from '../api/DataFetchApi';
import { ClimbingRoute } from '../classes/ClimbingRoute';
import { renderToStaticMarkup } from "react-dom/server"
import { Icon, divIcon } from 'leaflet'
import { RoutesFilter } from '../classes/RoutesFilter';
import MarkerClusterGroup from "react-leaflet-cluster";
import MarkerIconPng from "../resources/Pin.png"
import StarIcon from '@mui/icons-material/Star';

interface IMapViewProps {
    RouteFilter: RoutesFilter;
    ClimbingAreas?: ClimbingArea[];
    SetClimbingAreas: (areas: ClimbingArea[]) => void;
}

const MapView: React.FC<IMapViewProps> = (props: IMapViewProps) => {
    const [climbingRoutes, setClimbingRoutes] = useState<ClimbingRoute[]>();
    const [selecteAreaId, setSelecteAreadId] = useState<number>(-1);

    const lIcon = (new Icon({ iconUrl: MarkerIconPng }));

    const ic = (diff: string, routeType: string, delay: number) => {
        let colorClass = ""
        if (routeType.includes("Trad") && routeType.includes("TR") && routeType.includes("Sport")) {
            colorClass = "STTr"
        }
        else if (routeType.includes("Trad") && routeType.includes("Sport")) {
            colorClass = "ST"
        }
        else if (routeType.includes("TR") && routeType.includes("Sport")) {
            colorClass = "STr"
        }
        else if (routeType.includes("Trad") && routeType.includes("TR")) {
            colorClass = "TTr"
        }
        else if (routeType.includes("Sport")) {
            colorClass = "S"
        }
        else if (routeType.includes("Trad")) {
            colorClass = "T"
        }
        else if (routeType.includes("TR")) {
            colorClass = "Tr"
        }

        return (
            <div className={"routeCircle fadeIn " + colorClass} style={{ animationDelay: delay + "ms" }}>
                <div className="circleText" >
                    {diff}
                </div>
            </div>
        )
    }

    // Runs on render to fetch the default areas
    useEffect(() => {
        // Fetch the default areas
        GetClimbingAreas().then((data) => {
            props.SetClimbingAreas(data);
        }).catch((error) => {
            console.log("Error getting Climbing Areas", error);
        });
        // Throws a warning it shouldn't, we want to do this on load, disable warning
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setSelecteAreadId(-1);
        setClimbingRoutes(undefined);
    }, [props.RouteFilter]);

    // Fetch the routes for a selected area
    const fetchRoutes = (areaId: number) => {
        if (areaId === selecteAreaId) {
            setSelecteAreadId(-1);
            setClimbingRoutes(undefined);
        }
        else {
            setSelecteAreadId(areaId);
            GetFilteredRoutes(areaId, props.RouteFilter).then((data) => {
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
                    html: renderToStaticMarkup(ic(route.Difficulty.RouteGrade, route.RouteType, delay)),
                    className: "routeIcon"
                })
                markers.push(
                    <Marker key={route.Name} zIndexOffset={100} icon={routeIcon} position={[route.Latitude, route.Longitude]} >
                        <Tooltip offset={[0, 15]} direction="left">
                            <div>
                                {route.Name}
                            </div>
                            <div>
                                {route.Difficulty.RouteGrade}, {route.RouteType}{route.Length.Valid ? ", " + route.Length.Int32 + "ft" : ""}
                            </div>
                            <div>
                                {route.AvgStars} <StarIcon style={{ width: "12px", height: "12px" }} />'s
                            </div>
                        </Tooltip>
                    </Marker>
                );
                delay += interval;
            })
        }

        return markers;
    }

    const getAreaMarkers = (): JSX.Element[] => {
        let markers: JSX.Element[] = [];
        props.ClimbingAreas?.forEach((area) => {
            markers.push(
                <Marker key={area.Name} icon={lIcon} position={[area.Latitude, area.Longitude]} opacity={selecteAreaId !== -1 && area.Id !== selecteAreaId ? 0.5 : 1.0} eventHandlers={{
                    click: (e) => {
                        fetchRoutes(area.Id);
                    },
                }}>
                    <Tooltip offset={[0, 15]} direction='left'>
                        {area.Name}
                    </Tooltip>
                </Marker>
            );

        })

        return markers;
    }

    return (
        <div id="MapContent" className="column" style={{ flex: 4, paddingTop: "4px" }}>
            <MapContainer
                center={[43.802, -71.837]}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: "677px", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Keeping for demo purposes */}
                {/* {props.ClimbingAreas != null &&
                    <MarkerClusterGroup chunkedLoading spiderLegPolylineOptions={{ opacity: 0 }}>
                        {getAreaMarkers()}
                    </MarkerClusterGroup>
                } */}

                {props.ClimbingAreas != null &&
                    getAreaMarkers()}
                {climbingRoutes != null && getRouteMarkers()}

            </MapContainer>
        </div>
    )
}

export default MapView;