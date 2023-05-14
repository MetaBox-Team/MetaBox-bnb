import styled from "styled-components";

export namespace FollowsStyles {
  export const MainContainer = styled.div`
    flex: 1;
    background: #F2F8FE;
    display: flex;
    flex-direction: column;
    padding: 5.8rem 4.8rem 4.0rem 5.1rem;
  `

  export const TextContent = styled.div`
    display: flex;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 3.6rem;

    line-height: 4.4rem;
    color: #292929;
    padding-bottom: 2.4rem;
  `
  export const MainPanel = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #FFFFFF;
    border-radius: 1.8rem;
    padding: .0rem 4.0rem;
  `
  export const PanelHeader = styled.div`
    display: grid;
    height: 9.4rem;
    width: 100%;
    align-items: center;
    grid-template-columns: 9fr 1fr;
    border-bottom: .1rem solid #EDEEEE;
  `
  export const Bottonwidgets = styled.div`
    display: flex;
  `
  export const PanelHeaderBotton = styled.div<{ isSelect: boolean }>`
    height: 4.3rem;
    background: ${({isSelect}) => isSelect ? "#4E4597" : "#FFFFFF"};
    border-radius: 5.0rem;
    padding: 2.0rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 800;
    font-size: 2.1rem;
    line-height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({isSelect}) => isSelect ? "#FFFFFF" : "#787878"};
    cursor: pointer;
  `
  export const PanelHeaderBottonRight = styled.div`
    width: 5.3rem;
    height: 5.3rem;
    cursor: pointer;
  `

  export const ListItemWrap = styled.div`
    overflow: auto;
    flex: 1 1 .0rem;
    scrollbar-width: none;
    -ms-overflow-style: none;

    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  `
  export const ListItem = styled.div`
    display: flex;
    height: 15.5rem;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.1rem solid #EDEEEE;
    cursor: pointer;

    :hover {
      background-color: #F0F4FE
    }
  `
  export const ListItemPic = styled.div<{ url?: string }>`
    display: flex;
    min-width: 8.6rem;
    height: 8.6rem;
    border-radius: 50%;
    align-items: center;
    background: url(${({url}) => url ? url : "/avatar.jpg"}) no-repeat center center ;
    background-size: cover;
  `
  export const ListMsg = styled.div`
    margin-left: .8rem;
    display: flex;
    height: 15.5rem;
    flex-direction: column;
    justify-content: space-between;
    padding: 2.5rem;
  `
  export const ListMsgTitle = styled.div`
    justify-content: start;
    //margin: 1.8rem .0rem .0rem 2.7rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 2.4rem;
    line-height: 2.9rem;
    color: #2F49D1;

  `
  export const ListMsgInfo = styled.div`
    //margin-left: 1.8rem;
    max-width: 111.7rem;
    max-height: 6.0rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 3.0rem;
    height: 6.0rem;
    color: #787878;
    overflow: hidden;
  `

}
