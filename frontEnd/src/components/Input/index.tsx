import { UseFormRegister } from 'react-hook-form';
import { FormPoi } from '../../models/poi';
import { InputMain } from './styles';

type InputProps = {
  placeholder?: string | undefined;
  register?: UseFormRegister<FormPoi>;
  name?: 'name' | 'address' | 'description';
};

export default function Input({ placeholder, register, name }: InputProps) {
  const additionalProps = register && name ? { ...register(name) } : {};

  return (
    <InputMain type="text" placeholder={placeholder} {...additionalProps} />
  );
}
