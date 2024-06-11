import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  InfoWindow,
  Libraries,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import POIBox from '../../components/POIBox/index';
import RouteBox from '../../components/RouteBox';
import SearchBox from '../../components/SearchBox';
import pin from '../../images/pin.png';
import pinPoi from '../../images/pin_poi.png';
import pinRoute from '../../images/pin_route.png';
import { Poi } from '../../models/poi';
import { Map } from './styles';

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

export function MapPage() {
  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>();
  const [activeTab, setActiveTab] = useState(TABS.search);
  const [pois, setPois] = useState<Poi[]>([]);
  const [poiSelected, setPoiSelected] = useState<Poi | null>(null);

  const [pointA, setPointA] = useState<google.maps.LatLngLiteral>();
  const [pointB, setPointB] = useState<google.maps.LatLngLiteral>();
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>();
  const [destination, setDestination] =
    useState<google.maps.LatLngLiteral | null>();
  const [response, setResponse] =
    useState<google.maps.DistanceMatrixRequest | null>(null);

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

  const directionsCallback = useCallback((res: any) => {
    if (res !== null && res.status === 'OK') {
      setResponse(res);
    } else {
      console.log('res: ', res);
    }
  }, []);

  const directionsRendererOptions = useMemo<any>(() => {
    return {
      directions: response,
      markerOptions: {
        icon: {
          url: pinRoute,
          scaledSize: {
            width: 36,
            height: 36,
          },
        },
      },
    };
  }, [response]);

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
                <button
                  className={activeTab === TABS.route ? 'active' : ''}
                  onClick={() => setActiveTab(TABS.route)}
                >
                  Rota
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

              {activeTab === TABS.route && (
                <RouteBox
                  destinationChanged={onDestinationChanged}
                  originChanged={onOriginChanged}
                  traceRoute={traceRoute}
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
          {/* Rotas */}
          {!response && pointA && (
            <Marker
              position={pointA}
              icon={{
                url: pinRoute,
                scaledSize: new google.maps.Size(36, 36),
              }}
            />
          )}

          {!response && pointB && (
            <Marker
              position={pointB}
              icon={{
                url: pinRoute,
                scaledSize: new google.maps.Size(36, 36),
              }}
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
