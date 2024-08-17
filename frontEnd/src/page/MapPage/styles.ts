import styled from 'styled-components';

export const Map = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;

  justify-content: center;
  align-items: center;

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
    width: 280px;
  }

  .search-box-layer > nav {
    display: flex;
    width: 100%;
    flex-direction: row;
    margin-bottom: 8px;
    border-bottom: 1px solid #888;
  }

  .search-box-layer > nav > button {
    flex: 1 1 0;
    border: 0;
    padding: 8px 0;
    background-color: transparent;
  }

  .search-box-layer > nav > button.active {
    background-color: #ddd;
  }

  .search-box-layer > nav > button:nth-child(1) {
    border-right: 1px solid #888;
  }
`;

export const StepContainer = styled.div`
  width: 50%;
  display: flex;

  justify-content: center;
  align-items: center;
  gap: 8px;

  .step {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 8px;
  }
`;
