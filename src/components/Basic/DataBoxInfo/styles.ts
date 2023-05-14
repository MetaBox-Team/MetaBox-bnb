import styled from "styled-components";

export namespace DataBoxInfoStyles {

  export const ItemLeft = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
  `

  export const ItemLeftInfo = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 3rem 2.0rem;
    height: 100%;
    justify-content: space-around;
  `

  export const ItemLeftInfoName = styled.div`
    height: 2.9rem;
    display: flex;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 2.4rem;
    color: #2F49D1;
  `

  export const ItemLeftInfoDescription = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 1.6rem;
    color: #787878;
    max-height: 5.0rem;
    overflow: hidden;
  `
}
