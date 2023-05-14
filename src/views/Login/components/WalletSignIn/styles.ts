import styled from "styled-components";

export namespace WalletSigInStyles {


  export const Center = styled.div`
    max-width: 75.3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6.0rem 7.2rem 4.0rem 7.2rem;
    background: #FFFFFF;
    border-radius: 2.4rem;
    gap: 2.7rem;
    z-index: 1;
  `

  export const HeaderTip = styled.div`
    display: flex;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 3.2rem;
    line-height: 3.9rem;
    color: #000000;
  `

  export const WalletBoxRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 3.3rem;
    flex-wrap: wrap;
  `

  export const WalletBox = styled.div`
    width: 28.2rem;
    height: 21.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3.0rem;
    background: #FFFFFF;
    border: .1rem solid #C8D3F5;
    border-radius: 1.2rem;
    cursor: pointer;

    :hover {
      background: #F0F4FE;
    }
  `

  export const WalletIcon = styled.div<{ url: string }>`
    display: flex;
    width: 12rem;
    height: 12rem;
    background: #D9D9D9;
    background: url(${({url}) => url}) no-repeat center center;
    background-size: contain;
  `

  export const WalletName = styled.div`
    margin-top: 2.4rem;
    display: flex;
    height: 2.9rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 2.4rem;
  `

  export const InputWrap = styled.div<{ isHover: boolean }>`
    padding-left: 2.7rem;
    width: 100%;
    height: 8.9rem;
    border-radius: 1.2rem;
    border: .1rem solid #C8D3F5;
    background: #FFFFFF;
    filter: ${({isHover}) => isHover && "drop-shadow(.0rem .4rem .4rem rgba(0, 0, 0, 0.25));"}
  `
  export const Input = styled.input`
    height: 100%;
    width: 100%;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 2.7rem;

    ::placeholder {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 2.7rem;
      color: #787878;
      opacity: 0.6;
    }
  `

  export const BottomButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: .9rem;
  `

  export const ButtonSelected = styled.div`
    display: flex;
    width: 3.0rem;
    height: .9rem;
    background: #4E4597;
    border-radius: .7rem;
  `

  export const ButtonWaitSelect = styled.div`
    display: flex;
    width: .9rem;
    height: .9rem;
    background: #4E4597;
    opacity: 0.5;
    border-radius: .7rem;
  `


}
