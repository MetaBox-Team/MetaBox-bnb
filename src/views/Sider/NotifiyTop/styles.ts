import styled, {keyframes} from "styled-components";

export namespace NotifyTopStyles {

  export const ContentWrap = styled.div<{ isShow: boolean }>`
    position: absolute;
    width: 42.7rem;
    background: linear-gradient(152.98deg, rgba(255, 255, 255, 0.8) 0%, rgba(185, 179, 238, 0.8) 100%);
    backdrop-filter: blur(2.5rem);
    border-radius: 1.0rem;
    z-index: 10;
    left: 20rem;
    bottom: 17rem;
    display: flex;
    transform: ${({isShow}) => isShow ? "scale(1)" : "scale(0)"};
    opacity: ${({isShow}) => isShow ? 1 : 0};
    transform-origin: bottom left;
    flex-direction: column;
    align-items: center;
    padding: 0 2.4rem;
    transition: all 0.5s;
    cursor: default;
  `


  export const TitleWrap = styled.div`
    position: relative;
    height: 6.8rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.1rem;
    line-height: 2.5rem;
    border-bottom: .1rem solid rgba(0, 0, 0, 0.15);
    color: #000000;
  `
  export const CloseIcon = styled.div`
    position: absolute;
    top: 2.5rem;
    right: 2rem;
    cursor: pointer;
  `

  export const StreamWrap = styled.div`
    width: 100%;
    display: flex;
    flex-grow: 1;
    flex-basis: 50.0rem;
    flex-direction: column;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  `

  export const StreamItemWrap = styled.div<{ isRead: boolean; }>`
    width: 100%;
    padding: 2.1rem 0;
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-column-gap: 1.2rem;
    opacity: ${({isRead}) => isRead ? 0.4 : 1}; //已读则降低opacity
  `

  export const StreamItemWrapLeft = styled.div`
    display: flex;
    align-items: start;
  `

  export const ImgWrap = styled.div<{ url?: string }>`
    width: 4.6rem;
    height: 4.6rem;
    border-radius: 50%;
    background: url(${({url}) => url ? url : "/avatar.png"});
    background-size: cover;
  `
  export const InfoWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transition: height 0.5s;
  `
  export const SubInfoWrap = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `
  export const Text_time = styled.div`
    font-family: 'Inter_Light';
    font-style: normal;
    font-weight: 400;
    font-size: 1.4rem;
    line-height: 1.7rem;
    color: #787878;
  `
  export const Text_name = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 800;
    font-size: 1.6rem;
    line-height: 1.9rem;
    color: #4E4597;
  `
  export const Text_S = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.6rem;
    line-height: 1.9rem;
    color: #000000;
  `
  export const Gap_lr = styled.div<{ size: string }>`
    padding-left: ${({size}) => size ? size : ".9rem"};

  `
  export const Gap_tb = styled.div<{ size: string }>`
    padding-top: ${({size}) => size ? size : ".9rem"};
  `
  export const Poi = styled.div`
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    background: #4E4597;
  `

  export const FileInfoWrap = styled.div`
    display: flex;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.5rem;
    color: #030303;
  `
  export const ButtonWrap = styled.div`
    display: flex;

  `

  export const ButtonItemWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.1rem;
    cursor: pointer;
    background: #4E4597;
    border-radius: .4rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 1.4rem;
    color: #FFFFFF;
    padding: .7rem 3.3rem;
  `
}
