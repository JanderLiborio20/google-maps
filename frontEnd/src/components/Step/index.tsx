import { useState } from 'react';
import AddressFields from '../AddressFields';
import { AddressRoute } from '../AddressRoute';

export type LocationItem = {
  location: google.maps.LatLngLiteral;
  formattedAddress: string;
  distance: number;
};

type AddressBoxProps = {
  map?: google.maps.Map;
  onTraceRoute: (locations: LocationItem[]) => void;
  onSelectedLocation: (location: LocationItem) => void;
  onClear: () => void;
};

export default function AddressBox({
  map,
  onTraceRoute,
  onSelectedLocation,
  onClear,
}: AddressBoxProps) {
  const [origin, setOrigin] = useState<LocationItem | null>(null);
  const [destination, setDestination] = useState<LocationItem | null>(null);
  const [points, setPoints] = useState<LocationItem[]>([]);
  const [routePointsShowing, setRoutePointsShowing] = useState<LocationItem[]>(
    []
  );

  return (
    <>
      {routePointsShowing.length === 0 ? (
        <AddressFields
          map={map}
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          points={points}
          setPoints={setPoints}
          onTraceRoute={(points: any) => {
            setRoutePointsShowing(points);
            onTraceRoute(points);
          }}
          onSelectedLocation={onSelectedLocation}
        />
      ) : (
        <AddressRoute
          points={routePointsShowing}
          onClear={() => {
            setRoutePointsShowing([]);
            onClear();
          }}
        />
      )}
    </>
  );
}
