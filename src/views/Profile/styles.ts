import styled from "styled-components";

export namespace ProfileStyles {
  export const Main = styled.div`
    //left: 27.8rem;
    display: flex;
    flex: 1;
    //flex-direction: column;
    //align-items: center;
    //padding-bottom: 5.0rem;
  `
  export const ContentWrap = styled.div`
    display: flex;
    flex: 1;
    background: #F2F8FE;
    flex-direction: column;
    justify-content: flex-start;
    padding: 3rem 5.0rem;
    overflow-y: scroll;
  `
  export const Content = styled.div<{ isNFT?: boolean }>`
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  `

  export const Side = styled.div`
    width: 100%;
    height: 100%;
    //position: fixed;
    z-index: 10000;
    flex: 1;
  `

}
