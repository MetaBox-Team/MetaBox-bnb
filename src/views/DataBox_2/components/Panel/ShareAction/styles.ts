import styled from "styled-components";

export namespace ActionPanelStyles {
  export const MainContainer = styled.div<{ isShow: boolean }>`
    position: absolute;
    width: 15.3rem;
    display: flex;
    flex-direction: column;
    height: ${({isShow}) => isShow ? "auto" : "16rem"};
    z-index: 100;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.3);
    visibility: ${({isShow}) => isShow ? "visible" : "hidden"};
    opacity: ${({isShow}) => isShow ? 1 : 0};
    backdrop-filter: blur(1.0rem);
    border-radius: 1.0rem;
    transition: opacity 0.4s
  `

  export const Item = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1.8rem;
    color: white;
    padding: 1.2rem 0;
    cursor: pointer;
    border-bottom: .1rem solid rgba(255, 255, 255, 0.4);

    :hover {
      color: black;
    }
  `
}
