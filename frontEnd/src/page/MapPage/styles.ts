import styled from 'styled-components';

export const Map = styled.div`
  width: 100vw;
  height: 100vh;

  .search-box-container {
    position: absolute;
    display: flex;
    width: 100vw;
    justify-content: center;
    padding-top: 20px;
  }

  .search-box-layer {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 16px;
    border-radius: 8px;
    box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.3);
  }

  .search-box-input {
    font-size: 16px;
    border: 1px solid #888;
    border-radius: 4px;
    padding: 4px 8px;
    width: 280px;
  }
`;