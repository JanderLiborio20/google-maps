import { StandaloneSearchBox } from '@react-google-maps/api';
import { UseFormRegister } from 'react-hook-form';
import { FormPoi } from '../models/poi';
import Input from './Input';

const bounds = {
  north: -2.876,
  south: -3.241,
  east: -59.895,
  west: -60.115,
};

type ISearchBoxProps = {
  onLoad?: (searchBox: google.maps.places.SearchBox) => void;
  onPlacesChanged?: () => void;
  register?: UseFormRegister<FormPoi>;
  name?: 'name' | 'address' | 'description';
  placeholder?: string;
};

export default function SearchBox({
  onLoad,
  onPlacesChanged,
  name,
  register,
  placeholder,
}: ISearchBoxProps) {
  return (
    <StandaloneSearchBox
      onLoad={onLoad}
      onPlacesChanged={onPlacesChanged}
      options={{
        bounds: bounds,
      }}
    >
      <Input register={register} name={name} placeholder={placeholder} />
    </StandaloneSearchBox>
  );
}
