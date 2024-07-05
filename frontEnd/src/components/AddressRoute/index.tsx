import arrowDown from '../../images/arrow_down.png';
import { LocationItem } from '../Step';
import { Container } from './styles';

type AddressRouteProps = {
  points: LocationItem[];
  onClear: () => void;
};

export function AddressRoute({ onClear, points }: AddressRouteProps) {
  return (
    <Container>
      {points.map((point, index) => (
        <div key={`rounte-point-${index}`} className="address-box-route-list">
          {index === 0 ? null : (
            <div>
              <div>
                <strong>Distância: </strong>
                {(point.distance / 1000).toFixed(2)} km
              </div>
              <div className="address-box-route-list-img">
                <img src={arrowDown} alt="Arrow down" />
              </div>
            </div>
          )}
          <div>{point.formattedAddress}</div>
          <div className="address-box-route-list-img">
            {index === points.length - 1 ? null : (
              <img src={arrowDown} alt="Arrow down" />
            )}
          </div>
        </div>
      ))}
      <button className="address-box-route-button-clear" onClick={onClear}>
        Limpar
      </button>
    </Container>
  );
}
