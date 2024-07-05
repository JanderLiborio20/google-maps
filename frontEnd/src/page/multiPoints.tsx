import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import React, { useState } from 'react';
import AddressBox, { LocationItem } from '../components/Step';
import './MapView.css';

const libraries: any[] = ['places'];

const position = {
  lat: -3.1115891,
  lng: -59.9652881,
};

export interface MapPageProps {}

const MultiPoints = () => {
  const [map, setMap] = React.useState<google.maps.Map>();
  const [points, setPoints] = useState<LocationItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);

  const [response, setResponse] =
    React.useState<google.maps.DistanceMatrixResponse | null>(null);

  const onMapLoad = React.useCallback(function callback(map: google.maps.Map) {
    // const bounds = new window.google.maps.LatLngBounds(position);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const directionsServiceOptions =
    // @ts-ignore
    React.useMemo<google.maps.DirectionsRequest>(() => {
      if (points.length === 0 || points[0].location === undefined) {
        return;
      }
      return {
        origin: points[0].location,
        waypoints:
          points.length > 2
            ? points
                .slice(1, points.length - 1)
                .map((p) => ({ location: p.location }))
            : [],
        destination: points[points.length - 1].location,
        travelMode: 'DRIVING',
      };
    }, [points]);

  const directionsCallback = React.useCallback((res: any) => {
    if (res !== null && res.status === 'OK') {
      setResponse(res);
    } else {
      console.log(res);
    }
  }, []);

  const directionsRendererOptions = React.useMemo<any>(() => {
    return {
      directions: response,
    };
  }, [response]);

  return (
    <div className="map">
      <LoadScript
        googleMapsApiKey={`${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
        libraries={libraries}
        id="my-google-maps-routes"
        version="weekly"
      >
        <GoogleMap
          onLoad={onMapLoad}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={position}
          zoom={15}
        >
          <AddressBox
            map={map}
            onTraceRoute={(points: LocationItem[]) => {
              setPoints(points);
              setLocations([]); // Atualizar as localizações ao traçar nova rota
            }}
            onSelectedLocation={(location: LocationItem) => {
              setLocations((prev) => [...prev, location]);
            }}
            onClear={() => {
              setPoints([]);
              setLocations([]);
            }}
          />

          {locations.map((p, i) => {
            return <Marker key={`marker-item-${i}`} position={p.location} />;
          })}

          {points.length > 0 && (
            <DirectionsService
              options={directionsServiceOptions}
              callback={directionsCallback}
            />
          )}

          {points.length > 0 && response && directionsRendererOptions && (
            <DirectionsRenderer options={directionsRendererOptions} />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MultiPoints;
