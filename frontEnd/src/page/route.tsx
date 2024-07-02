import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  Libraries,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import RouteBox from '../components/RouteBox';
import pinRoute from '../images/pin_route.png';
import { Map } from './MapPage/styles';

const center = {
  lat: -3.1115891,
  lng: -59.9652881,
};

const TABS = {
  search: 0,
  poi: 1,
  route: 2,
};

const libraries: Libraries = ['places'];

const VITE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function Route() {
  const [map, setMap] = useState<google.maps.Map>();
  const [activeTab, setActiveTab] = useState(TABS.route);

  const [pointA, setPointA] = useState<google.maps.LatLngLiteral | null>(null);
  const [pointB, setPointB] = useState<google.maps.LatLngLiteral | null>(null);
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [destination, setDestination] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [response, setResponse] = useState<google.maps.DirectionsResult | null>(
    null
  );

  const traceRoute = () => {
    if (pointA && pointB) {
      setOrigin(pointA);
      setDestination(pointB);
    }
  };

  const onPointChanged = (point: google.maps.LatLngLiteral) => {
    setOrigin(null);
    setDestination(null);
    setResponse(null);
    map?.panTo(point);
  };

  const onOriginChanged = (point: google.maps.LatLngLiteral) => {
    setPointA(point);
    onPointChanged(point);
  };

  const onDestinationChanged = (point: google.maps.LatLngLiteral) => {
    setPointB(point);
    onPointChanged(point);
  };

  const directionsServiceOption =
    // @ts-ignore
    useMemo<google.maps.DirectionsRequest>(() => {
      return {
        origin,
        destination,
        travelMode: 'DRIVING',
      };
    }, [origin, destination]);

  const directionsCallback = useCallback(
    (
      res: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (res !== null && status === 'OK') {
        setResponse(res);
      } else {
        console.log('Directions request failed due to ', status);
      }
    },
    []
  );

  const directionsRendererOptions = useMemo<any>(() => {
    return {
      directions: response,
      suppressMarkers: true, // Supress automatic markers
    };
  }, [response]);

  const handleMarkerDragEnd = (
    event: google.maps.MapMouseEvent,
    setPoint: (point: google.maps.LatLngLiteral) => void
  ) => {
    const newLat = event.latLng?.lat();
    const newLng = event.latLng?.lng();
    if (newLat !== undefined && newLng !== undefined) {
      const newPoint = { lat: newLat, lng: newLng };
      setPoint(newPoint);
    }
  };

  useEffect(() => {
    if (pointA && pointB) {
      traceRoute();
    }
  }, [pointA, pointB]);

  return (
    <LoadScript
      googleMapsApiKey={VITE_MAPS_API_KEY}
      libraries={libraries}
      region="Amazonas"
    >
      <Map>
        <GoogleMap
          center={center}
          zoom={16}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          onLoad={setMap}
        >
          <div className="search-box-container">
            <div className="search-box-layer">
              <nav>
                <button
                  className={activeTab === TABS.search ? 'active' : ''}
                  onClick={() => setActiveTab(TABS.search)}
                >
                  Busca
                </button>
                <button
                  className={activeTab === TABS.poi ? 'active' : ''}
                  onClick={() => setActiveTab(TABS.poi)}
                >
                  POI
                </button>
                <button
                  className={activeTab === TABS.route ? 'active' : ''}
                  onClick={() => setActiveTab(TABS.route)}
                >
                  Rota
                </button>
              </nav>

              {activeTab === TABS.route && (
                <RouteBox
                  destinationChanged={onDestinationChanged}
                  originChanged={onOriginChanged}
                  traceRoute={traceRoute}
                />
              )}
            </div>
          </div>

          {pointA && (
            <Marker
              position={pointA}
              icon={{
                url: pinRoute,
                scaledSize: new google.maps.Size(36, 36),
              }}
              draggable={true}
              onDragEnd={(event) => handleMarkerDragEnd(event, setPointA)}
            />
          )}

          {pointB && (
            <Marker
              position={pointB}
              icon={{
                url: pinRoute,
                scaledSize: new google.maps.Size(36, 36),
              }}
              draggable={true}
              onDragEnd={(event) => handleMarkerDragEnd(event, setPointB)}
            />
          )}

          {origin && destination && (
            <DirectionsService
              options={directionsServiceOption}
              callback={directionsCallback}
            />
          )}

          {response && directionsRendererOptions && (
            <DirectionsRenderer options={directionsRendererOptions} />
          )}
        </GoogleMap>
      </Map>
    </LoadScript>
  );
}
