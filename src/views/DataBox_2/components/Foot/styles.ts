import styled, {keyframes} from "styled-components"

export namespace FootStyles {

  export const Foot = styled.div<{ isMutiSelect: boolean }>`
    position: absolute;
    width: 100%;
    height: 9.1rem;
    display: flex;
    transform: ${({isMutiSelect}) => isMutiSelect ? "scaleY(1)" : "scaleY(0)"};
    opacity: ${({isMutiSelect}) => isMutiSelect ? 1 : 0};
    transform-origin: 0 100%;
    background: #F4F4F4;
    align-items: center;
    justify-content: space-between;
    padding: 0 2.0rem 0 8.7rem;
    left: 0;
    bottom: 0;
    transition: all 0.5s;
    border-radius: 1.2rem;
  `

  export const FootLeft = styled.div`
    height: 4.9rem;
    display: flex;
  `
}
