import styled, {keyframes} from "styled-components";

export namespace ManageStyles {
  export const MainContainer = styled.div`
    flex: 1;
    max-height: 100%;
    background: #F2F8FE;
    display: flex;
    flex-direction: column;
    padding: 4.5rem 4.8rem 4.0rem 5.1rem;
  `


  export const Panel = styled.div`
    height: 20rem;
    position: relative;
    background: #4E4597;
    border-radius: 1.8rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    padding: 3rem;
  `

  export const WelcomeText = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 4.3rem;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
  `

  export const Description = styled.div`
    width: 60%;
    font-family: 'Inter';
    font-weight: 400;
    font-style: oblique;
    font-size: 2.5rem;
    color: #FFFFFF;
    opacity: 0.8;
  `

  export const Img = styled.div`
    position: absolute;
    top: -8rem;
    right: 5.0rem;
    width: 43rem;
    height: 35rem;
    background: url("/img_4.png");
    background-size: cover;
  `

  export const MiddleWrap = styled.div<{ isOwner?: boolean }>`
    height: 5.0rem;
    display: grid;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.5rem;
    color: #292929;
    align-items: center;
    margin: 3rem 0 1.8rem;
    grid-template-columns:${({isOwner}) => isOwner ? "7fr 3fr" : "1fr 0fr"};
    grid-column-gap: 3.7rem;
  `

  export const MiddleWrapLeft = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `

  export const ChangeIcon = styled.div`
    cursor: pointer;
    width: 2.8rem;
    height: 2.4rem;
    z-index: 5;
    background: url("/img_6.png");
    background-size: cover;

  `

  export const BottomWrap = styled.div<{ isOwner?: boolean }>`
    flex: 1;
    display: grid;
    grid-template-columns:${({isOwner}) => isOwner ? "7fr 3fr" : "1fr 0fr"};
    grid-column-gap: 3.7rem;
  `

  export const MostDownload = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    border-radius: 1.8rem;
  `

  export const NonMostDownloadItemWrap = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
  `

  export const NonMostDownloadItem = styled.div`
    display: flex;
    background: url("/img_7.png") no-repeat center;
    background-size: contain;
    height: 100%;
    width: 100%;
  `
  export const MostDownloadItem = styled.div`
    height: 7.5rem;
    display: grid;
    grid-template-columns: 3fr 0.5fr 0.6fr;
    justify-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.5rem;
    padding: 1.8rem 0 1.8rem 0;
    border-bottom: .1rem solid #EDEEEE;
    color: #030303;
  `

  export const MostDownloadItemLeft = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 2rem;
  `

  export const MostDownloadItemRight = styled.div`
    display: flex;
    cursor: pointer;
    align-items: center
  `


}
