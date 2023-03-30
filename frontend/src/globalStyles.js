import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    first: '#white',
    second: '#cacaca',
    button: '#b0b0b0',
    text: 'black',
  },
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  };
  
`;

export default GlobalStyle;
