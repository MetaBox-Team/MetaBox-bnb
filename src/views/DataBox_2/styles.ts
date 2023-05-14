import styled from "styled-components";

export namespace DataBoxStyles {
  export const DataBoxWrap = styled.div`
    flex: 1;
    background: #F2F8FE;
    display: flex;
    flex-direction: column;
    padding: 5.8rem 4.8rem 4.0rem 5.1rem;
  `;

  export const MiddleWrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 3.6rem;

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

  export const MiddleWrapRight = styled.div`
    height: 100%;
    display: flex;
    align-items: end;
  `

  export const Table = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    border-radius: 1.8rem;
    padding: 3.0rem 3.9rem 1.0rem 2.1rem;
  `
  export const TableHead = styled.div`
    display: flex;
    justify-content: space-between;
    border-bottom: .1rem solid #EDEEEE;
    padding-bottom: 2.3rem;
  `

  export const TableHeadLeft = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-right: 4.0rem;
  `

  export const TableHeadLeftItem = styled.div<{ isClick: boolean }>`
    padding: .9rem 1.5rem;
    display: flex;
    border-radius: 5.0rem;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    cursor: pointer;
    font-size: 2.1rem;
    color: ${({isClick}) => isClick ? "#ffffff" : "#787878"};
    background-color: ${({isClick}) => isClick && "#4E4597"};
    transition: all 0.2s;
  `
  export const TableHeadRight = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `

  export const SearchBox = styled.div`
    height: 4.8rem;
    display: flex;
    align-items: center;
    border-radius: 5.0rem;
    background: rgba(217, 217, 217, 0.3);
    padding: 1.5rem;
  `

  export const Input = styled("input")`
    font-family: 'Inter';
    width: 50%;
    font-style: normal;
    font-weight: 500;
    font-size: 2.0rem;
    color: #787878;

    ::placeholder {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 2.0rem;
      color: #787878;
    }
  `

  export const TableTittle = styled.div`
    height: 6.8rem;
    width: 100%;
    display: grid;
    align-items: center;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 1.8rem;
    color: #9A9A9A;
    padding-left: 1.9rem;
  `

  export const NonTableList = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    padding: 5.0rem;
  `
  export const NonListPic = styled.div`
    display: flex;
    background: url("/img_10.png") no-repeat center;
    background-size: contain;
    height: 100%;
    width: 100%;
  `

}
