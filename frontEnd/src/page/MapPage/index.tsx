import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Map } from './styles';

const center = {
  lat: -3.0490275,
  lng: -60.0101314,
};
export function MapPage() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDzECH7dCwncwk7GY1feEeGmqtYJlMEojk">
      <Map>
        <GoogleMap
          center={center}
          zoom={13}
          mapContainerStyle={{ width: '100%', height: '100%' }}
        />
      </Map>
    </LoadScript>
  );
}
