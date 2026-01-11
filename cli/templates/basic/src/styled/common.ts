import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  html,body,#__next {
    height: 100%;
    border: 1px solid white;
  }

  body {
    background-color: ${(props: any) => (props.whiteColor ? 'white' : 'black')};
    font-family: Helvetica;
    margin: 0;
  }
`

export const theme = {
  colors: {
    primary: '#0070f3'
  }
}

export const theme2 = {
  colors: {
    primary: 'black'
  }
}
