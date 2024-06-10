import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormPoi } from '../../models/poi';
import Input from '../Input';
import SearchBox from '../SearchBox';
import { POIContainerForm } from './styles';

type IPOIBoxProps = {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  onPoiSaved: () => void;
};

export default function POIBox({ onPlaceSelected, onPoiSaved }: IPOIBoxProps) {
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();

  const handleOnPlacesChanged = () => {
    const searchBoxPlaces = searchBox!.getPlaces();
    const place = searchBoxPlaces![0];

    if (place.geometry && place.geometry.location) {
      onPlaceSelected(place);
      setValue('address', place.formatted_address || '');
      setValue('lat', place.geometry.location.lat());
      setValue('lng', place.geometry.location.lng());
    }
  };

  const { register, handleSubmit, setValue } = useForm<FormPoi>();

  const save = (data: FormPoi) => {
    fetch('http://localhost:3001/v1/poi', {
      headers: {
        'Content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    }).then(async (response) => {
      const json = await response.json();
      if (response.ok) {
        onPoiSaved();
        setValue('address', '');
        setValue('description', '');
        setValue('name', '');
      } else {
        console.log('Erro ', json.message);
      }
    });
  };

  useEffect(() => {
    register('lat');
    register('lng');
  }, [register]);

  return (
    <POIContainerForm onSubmit={handleSubmit(save)}>
      <SearchBox
        onLoad={setSearchBox}
        onPlacesChanged={handleOnPlacesChanged}
        register={register}
        name="address"
      />

      <Input placeholder="Nome" register={register} name="name" />
      <Input placeholder="Descrição" register={register} name="description" />

      <button className="button-poi-save" type="submit">
        Salvar
      </button>
    </POIContainerForm>
  );
}
