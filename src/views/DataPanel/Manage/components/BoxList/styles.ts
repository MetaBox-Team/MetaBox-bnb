import styled from "styled-components";

export namespace BoxListStyles {
  export const MainContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    border-radius: 1.8rem;
  `

  export const Head = styled.div`
    height: 8.8rem;
    display: flex;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.1rem;
    color: #787878;
    padding-left: 3.9rem;
    border-bottom: .1rem solid #C8D3F5;
  `
  export const NonItemWrap = styled.div`
    display: flex;
    justify-content: center;
    flex: 1;
  `

  export const NonItem = styled.div`
    display: flex;
    background: url("/img_7.png") no-repeat center;
    background-size: contain;
    width: 100%;
    height: 100%;
  `

  export const Item = styled.div`
    height: 14.3rem;
    display: grid;
    padding-left: 2rem;
    grid-template-columns:8fr 2fr 1fr;
    align-items: center;
    border-top: .1rem solid rgba(200, 211, 245, 0.5);
    border-bottom: .1rem solid rgba(200, 211, 245, 0.5);
    cursor: pointer;

    :hover {
      background-color: rgba(200, 211, 245, 0.1);
    }
  `

  export const ItemRight = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
  `


}
