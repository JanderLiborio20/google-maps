import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import { useState } from 'react';
import { Map } from './styles';

const center = {
  lat: -3.1115891,
  lng: -59.9652881,
};

const VITE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function MapPage() {
  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [locations, setLocation] = useState<google.maps.LatLngLiteral[]>([]);

  const handleOnPlacesChanged = () => {
    const places = searchBox!.getPlaces();
    const place = places![0];

    const location = {
      lat: place.geometry?.location?.lat() || 0,
      lng: place.geometry?.location?.lng() || 0,
    };

    setLocation((currentLocation) => [...currentLocation, location]);

    map?.panTo(location);
  };

  return (
    <LoadScript googleMapsApiKey={VITE_MAPS_API_KEY} libraries={['places']}>
      <Map>
        <GoogleMap
          center={center}
          zoom={16}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          onLoad={setMap}
        >
          <div className="search-box-container">
            <div className="search-box-layer">
              <StandaloneSearchBox
                onLoad={setSearchBox}
                onPlacesChanged={handleOnPlacesChanged}
              >
                <input type="text" className="search-box-input" />
              </StandaloneSearchBox>
            </div>
          </div>

          {locations.map((location, index) => (
            <Marker key={index} position={location} />
          ))}
        </GoogleMap>
      </Map>
    </LoadScript>
  );
}
