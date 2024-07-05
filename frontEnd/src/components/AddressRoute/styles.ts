import styled from 'styled-components';

export const Container = styled.div`
  box-sizing: border-box;
  width: 240px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  font-size: 14px;
  position: absolute;
  left: 50%;
  margin-left: -120px;
  margin-top: 12px;

  .address-box-route-list .address-box-route-list-img {
    display: flex;
    width: '100%';
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .address-box-route-list .address-box-route-list-img > img {
    width: 20px;
    height: 20px;
    margin: 0.5rem 0;
  }

  .address-box-route-button-clear {
    margin-top: 1rem;
  }
`;
