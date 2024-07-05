import { StandaloneSearchBox } from '@react-google-maps/api';
import { useState } from 'react';
import { LocationItem } from '../Step';

type AddressFieldsProps = {
  map?: google.maps.Map;
  origin: LocationItem | null;
  setOrigin: React.Dispatch<React.SetStateAction<LocationItem | null>>;
  destination: LocationItem | null;
  setDestination: React.Dispatch<React.SetStateAction<LocationItem | null>>;
  points: LocationItem[];
  setPoints: React.Dispatch<React.SetStateAction<LocationItem[]>>;
  onTraceRoute: (points: LocationItem[]) => void;
  onSelectedLocation: (point: LocationItem) => void;
};

type SearchBoxItem = {
  id: string;
  ref: google.maps.places.SearchBox;
};

export default function AddressFields({
  map,
  origin,
  setOrigin,
  destination,
  setDestination,
  points,
  setPoints,
  onTraceRoute,
  onSelectedLocation,
}: AddressFieldsProps) {
  const [searchBoxes, setSearchBoxes] = useState<SearchBoxItem[]>([]);

  const bounds = {
    north: -2.876,
    south: -3.241,
    east: -59.895,
    west: -60.115,
  };

  const handleOnLoad = (ref: google.maps.places.SearchBox, id: string) => {
    if (searchBoxes.find((i) => i.id === id) !== undefined) {
      return;
    }

    setSearchBoxes((prev) => [...prev, { id, ref }]);
  };

  const handleOnPlacesChanged = (id: string) => {
    console.log('id: ', id);
    const searchBox = searchBoxes.find((i) => i.id === id)?.ref;
    if (!searchBox) {
      return;
    }
    const places = searchBox.getPlaces();
    if (!places) {
      return;
    }
    const place = places[0];
    const location = {
      lat: place.geometry?.location?.lat() || 0,
      lng: place.geometry?.location?.lng() || 0,
    };
    const point = {
      location,
      formattedAddress: place.formatted_address || '',
      distance: 0,
    };
    switch (id) {
      case 'origin':
        setOrigin(point);
        break;
      case 'destination':
        setDestination(point);
        break;
      default:
        setPoints((prev) => [...prev, point]);
    }
    onSelectedLocation(point);
    map?.panTo(location);
  };

  const getDistance = (
    point1: LocationItem,
    point2: LocationItem
  ): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!map) {
        reject(-1);
        return;
      }
      if (!point1 || !point1.location || !point2 || !point2.location) {
        return;
      }
      const directionsService = new google.maps.DirectionsService();
      const request: any = {
        origin: point1.location,
        destination: point2.location,
        travelMode: 'DRIVING',
      };

      directionsService.route(request, (response: any, status: any) => {
        if (status !== 'OK') {
          reject(-1);
        } else {
          const directionsData = response.routes[0].legs[0];
          if (!directionsData) {
            reject(-1);
          } else {
            resolve(Number(directionsData.distance.value));
          }
        }
      });
    });
  };

  const handleTraceRoute = async () => {
    if (origin && destination) {
      const routePoints: LocationItem[] = [];
      routePoints.push(origin);

      while (routePoints.length < points.length + 1) {
        let closestPoint: LocationItem | undefined;
        for (const point of points) {
          const dist = await getDistance(
            routePoints[routePoints.length - 1],
            point
          );
          if (
            routePoints.find((i) => i.location === point.location) ===
              undefined &&
            (!closestPoint || dist < closestPoint.distance)
          ) {
            point.distance = dist;
            closestPoint = point;
          }
        }
        if (closestPoint) {
          routePoints.push(closestPoint);
        }
      }

      const dist = await getDistance(
        routePoints[routePoints.length - 1],
        destination
      );
      destination.distance = dist;
      routePoints.push(destination);
      console.log('routePoints: ', routePoints);
      onTraceRoute(routePoints);
    }
  };

  return (
    <div className="address">
      <StandaloneSearchBox
        onLoad={(ref) => handleOnLoad(ref, 'origin')}
        onPlacesChanged={() => handleOnPlacesChanged('origin')}
        options={{
          bounds: bounds,
        }}
      >
        <input
          className="addressField"
          placeholder="Digite o endereço de origem"
        />
      </StandaloneSearchBox>

      <StandaloneSearchBox
        onLoad={(ref) => handleOnLoad(ref, '2')}
        onPlacesChanged={() => handleOnPlacesChanged('2')}
        options={{
          bounds: bounds,
        }}
      >
        <input className="addressField" placeholder="Digite um endereço" />
      </StandaloneSearchBox>

      <StandaloneSearchBox
        onLoad={(ref) => handleOnLoad(ref, '3')}
        onPlacesChanged={() => handleOnPlacesChanged('3')}
        options={{
          bounds: bounds,
        }}
      >
        <input className="addressField" placeholder="Digite um endereço" />
      </StandaloneSearchBox>

      <StandaloneSearchBox
        onLoad={(ref) => handleOnLoad(ref, '4')}
        onPlacesChanged={() => handleOnPlacesChanged('4')}
        options={{
          bounds: bounds,
        }}
      >
        <input className="addressField" placeholder="Digite um endereço" />
      </StandaloneSearchBox>

      <StandaloneSearchBox
        onLoad={(ref) => handleOnLoad(ref, 'destination')}
        onPlacesChanged={() => handleOnPlacesChanged('destination')}
        options={{
          bounds: bounds,
        }}
      >
        <input
          className="addressField"
          placeholder="Digite o endereço de destino"
        />
      </StandaloneSearchBox>

      <button onClick={handleTraceRoute}>Traçar Rota</button>
    </div>
  );
}
