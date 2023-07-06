import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    first: '#white',
    second: '#cacaca',
    third: 'rgb(202, 202, 202)',
    button: '#b0b0b0',
    text: 'black',
  },
};

const GlobalStyle = createGlobalStyle`
  * {
    user-select: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;

    overflow: hidden;
    background-color: white;
  };


  ::-webkit-scrollbar {
    width: 0;  /* Remove scrollbar space */
    background: transparent;  /* Optional: just make scrollbar invisible */
}
  
`;

export default GlobalStyle;
