import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;

  a {
    margin: 5px;
    color: ${(props: any) => props.theme?.colors?.primary || '#0070f3'};
  }

  p {
    color: green;
  }
`
