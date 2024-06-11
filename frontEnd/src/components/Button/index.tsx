import { ButtonMain } from './styles';

type IButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: 'submit' | 'reset' | 'button' | undefined;
  onClick?: () => void;
};

export default function Button({
  children,
  type,
  className,
  onClick,
}: IButtonProps) {
  return (
    <ButtonMain type={type} className={className} onClick={onClick}>
      {children}
    </ButtonMain>
  );
}
