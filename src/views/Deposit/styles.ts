import styled from "styled-components";

export namespace DepositStyles {
  export const MainStyles = styled.div`
    display: flex;
    flex: 1;
    background: #F2F8FE;
    justify-content: center;
    padding-top: 5rem;
  `

  export const ContentWrap = styled.div`
    width: 100rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rem;
  `

  export const ContentHead = styled.div`
    display: flex;
    align-items: center;
    background-color: rgba(241, 237, 245, 0.88);
    border-radius: 0.5rem;
    padding: 1rem 1.2rem;
    justify-content: center;
    gap: 2rem
  `
  export const ContentHeadItem = styled.div<{ isClick: boolean }>`
    display: flex;
    font-size: 2rem;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    padding: 0.3rem 0.6rem;
    color: ${({isClick}) => isClick ? "white" : "#8988B7"};
    background-color: ${({isClick}) => isClick ? "#947DE1" : "inherit"};
    border-radius: 0.5rem;
    cursor: pointer;
  `

  export const ContentBody = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 2.5rem 4rem;
    border-radius: 0.75rem;
    background-color: white;
    align-items: center;
    gap: 4rem;
    justify-content: space-between;
  `
  export const BodyHead = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    padding: 3rem 0;
    gap: 3rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2)
  `

  export const BodyHeadTittle = styled.div`
    font-weight: 700;
    font-size: 2.2rem;
  `

  export const BodyHeadContent = styled.div`
    font-size: 1.2rem;
  `

  export const BodyCenter = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 3rem;
  `

  export const BodyButton = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem;
    justify-content: center;
    border-radius: 0.5rem;
    background-color: #CDCDD9;
    cursor: pointer;
    margin-top: 5rem;
  `

  export const BodyInput = styled.div`
    display: flex;
    height: 6rem;
    border-radius: 0.5rem;
    padding: 0 1.5rem;
    background: #F7F7FB;
    position: relative;
  `

  export const Input = styled.input`
    text-align: right;
    flex: 1;
  `

  export const SelectWrap = styled.div<{ isShow: boolean }>`
    top: 4.5rem;
    left: 0;
    width: 30rem;
    display: ${({isShow}) => isShow ? "flex" : "none"};
    flex-direction: column;
    padding: 1.5rem 0.5rem;
    border-radius: 0.7rem;
    background-color: #F2F8FE;
    position: absolute;
    gap: 1.5rem;
    z-index: 10;

  `

  export const TokenItem = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 0.6rem;
    padding: 0.5rem 1rem;
    justify-content: space-between;

    :hover {
      background-color: white;
    }
  `

}
