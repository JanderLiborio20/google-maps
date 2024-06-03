import {
  GoogleMap,
  InfoWindow,
  Libraries,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import { useState } from 'react';
import pin from '../../images/pin.png';
import { Map } from './styles';

const center = {
  lat: -3.1115891,
  lng: -59.9652881,
};

const bounds = {
  north: -2.876,
  south: -3.241,
  east: -59.895,
  west: -60.115,
};

const libraries: Libraries = ['places'];

const VITE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function MapPage() {
  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>();

  const handleOnPlacesChanged = () => {
    const searchBoxPlaces = searchBox!.getPlaces();
    const place = searchBoxPlaces![0];

    setPlaces((currentLocation) => [...currentLocation, place]);

    setSelectedPlace(null);

    if (place.geometry && place.geometry.location) {
      map?.panTo(place.geometry.location);
    }
  };

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
              <StandaloneSearchBox
                onLoad={setSearchBox}
                onPlacesChanged={handleOnPlacesChanged}
                options={{
                  bounds: bounds,
                }}
              >
                <input type="text" className="search-box-input" />
              </StandaloneSearchBox>
            </div>
          </div>

          {places.map((place, index) => (
            <>
              {place.geometry && place.geometry.location ? (
                <Marker
                  key={index}
                  position={place.geometry.location}
                  onClick={() => setSelectedPlace(place)}
                  icon={pin}
                >
                  {selectedPlace && selectedPlace === place && (
                    <InfoWindow
                      key={`info-window-${index}`}
                      onCloseClick={() => setSelectedPlace(null)}
                    >
                      <div>
                        <h1>Info Window</h1>
                        <p>{selectedPlace.formatted_address}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ) : null}
            </>
          ))}
        </GoogleMap>
      </Map>
    </LoadScript>
  );
}
