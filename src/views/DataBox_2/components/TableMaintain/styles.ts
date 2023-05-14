import styled, {keyframes} from "styled-components";

export namespace ListItemStyles {


  export const TableMaintain = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-basis: .0rem;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;

    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  `
  export const TableItem = styled.div<{ isClick: boolean }>`
    width: 100%;
    min-height: 7.4rem;
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    align-items: center;
    background-color: ${({isClick}) => isClick && "#F0F4FE"};
    border-radius: 1.2rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 2.1rem;
    color: #030303;
    padding-left: 1.9rem;
    cursor: pointer;
    margin-bottom: 1.0rem;

    :hover {
      background-color: rgba(237, 238, 238, 0.5)
    }
  `

  export const ShareWrap = styled.div`
    width: 100%;
    display: flex;
  `
  export const ButtonWrap = styled.div<{ isClick: boolean }>`
    display: flex;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.1rem;
    padding: 1.6rem 1.5rem;
    background-color: ${({isClick}) => isClick ? "#4E4597" : "#F6F7F7"};
    color: ${({isClick}) => isClick ? "#FFFFFF" : "#787878"};
    border-radius: .9rem;
    cursor: pointer;
  `

}
