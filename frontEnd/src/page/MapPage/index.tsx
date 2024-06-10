import {
  GoogleMap,
  InfoWindow,
  Libraries,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';
import POIBox from '../../components/POIBox/index';
import SearchBox from '../../components/SearchBox';
import pin from '../../images/pin.png';
import pinPoi from '../../images/pin_poi.png';
import { Poi } from '../../models/poi';
import { Map } from './styles';

const center = {
  lat: -3.1115891,
  lng: -59.9652881,
};

const TABS = {
  search: 0,
  poi: 1,
};

const libraries: Libraries = ['places'];

const VITE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function MapPage() {
  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>();
  const [activeTab, setActiveTab] = useState(TABS.search);
  const [pois, setPois] = useState<Poi[]>([]);
  const [poiSelected, setPoiSelected] = useState<Poi | null>(null);

  const mapPanTo = (place: google.maps.places.PlaceResult) => {
    if (place.geometry && place.geometry.location) {
      map?.panTo(place.geometry.location);
    }
  };

  const handleOnPlacesChanged = () => {
    const searchBoxPlaces = searchBox!.getPlaces();
    const place = searchBoxPlaces![0];

    setPlaces((currentLocation) => [...currentLocation, place]);

    setSelectedPlace(null);

    mapPanTo(place);
  };

  const updatePois = useCallback(() => {
    fetch('http://localhost:3001/v1/poi', {
      headers: {
        'Content-type': 'application/json',
      },
      method: 'GET',
    }).then(async (response) => {
      const json = await response.json();
      if (response.ok) {
        setPois(json.pois);
      } else {
        console.log('Erro ', json.message);
      }
    });
  }, []);

  useEffect(() => {
    updatePois();
  }, [updatePois]);

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
              </nav>

              {activeTab === TABS.search && (
                <SearchBox
                  onLoad={setSearchBox}
                  onPlacesChanged={handleOnPlacesChanged}
                />
              )}

              {activeTab === TABS.poi && (
                <POIBox
                  onPlaceSelected={(place) => mapPanTo(place)}
                  onPoiSaved={updatePois}
                />
              )}
            </div>
          </div>

          {places.map((place, index) => (
            <>
              {place.geometry && place.geometry.location ? (
                <Marker
                  key={index}
                  position={place.geometry.location}
                  onClick={() => setSelectedPlace(place)}
                  icon={{
                    url: pin,
                    scaledSize: new google.maps.Size(36, 36),
                  }}
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
          {pois.map((poi, index) => (
            <Marker
              key={`marker-poi-${index}`}
              position={{
                lat: poi.lat,
                lng: poi.lng,
              }}
              onClick={() => setPoiSelected(poi)}
              icon={{
                url: pinPoi,
                scaledSize: new google.maps.Size(36, 36),
              }}
            >
              {poiSelected && poiSelected === poi && (
                <InfoWindow
                  key={`info-window-poi-${index}`}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div>
                    <h1>Ponto de Interesse (POI)</h1>
                    <div>
                      <strong>Endereço: </strong>
                      {poiSelected.address}
                    </div>
                    <div>
                      <strong>Nome: </strong>
                      {poiSelected.address}
                    </div>
                    <div>
                      <strong>Descrição: </strong>
                      {poiSelected.description}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </Map>
    </LoadScript>
  );
}
