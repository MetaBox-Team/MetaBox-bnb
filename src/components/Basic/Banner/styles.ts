import styled, {keyframes} from "styled-components";

export namespace BannerStyles {

  export const TheBanner = styled.div`
    position: absolute;
    height: 4rem;
    display: flex;
    justify-content: center;
    width: 155rem;
    top: 0.5rem;
    left: 33rem;
  `
  export const BannerContent = styled.div`
    width: 100%;
    border-radius: 1rem;
    position: absolute;
    cursor: pointer;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: end;
    z-index: 100;
    background: linear-gradient(rgba(185, 179, 238, 0.5), rgba(185, 179, 238, 0.5));
    overflow: hidden;
  `

  const rote = keyframes`
    0% {
      right: -20%
    }
    100% {
      right: 100%;
    }
  `

  export const BannerText = styled.div`
    position: absolute;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    animation: ${rote} 20s linear infinite;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
  `
}
