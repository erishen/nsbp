import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 20px;

  .demo4 {
    display: flex;
    align-items: center;
    height: 700px;
    position: relative;

    .demo4-inner {
      overflow: hidden;
      position: relative;
      margin: auto;

      .demo4-photo {
        position: absolute;
        background-color: lightgray;
      }
    }
  }
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  padding-bottom: 10px;

  a {
    padding-right: 10px;
  }
`
