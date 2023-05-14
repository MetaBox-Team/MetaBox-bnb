import styled, {keyframes} from "styled-components";

export namespace LoginStyles {
  export const Body = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-column-gap: 2rem;
    padding: 2rem 0;
  `
  export const AvatarWrap = styled.div`
    justify-self: end;
  `

  export const ErrorText = styled.div`
    position: absolute;
    top: 25%;
    right: 2.4rem;
    display: flex;
    align-items: center;
    font-family: 'Noto Sans CJK SC';
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    color: #FD0606;
    opacity: 0.6;
  `
  export const Radio = styled.div`
    font-family: 'Inter';
    font-style: normal;
    display: flex;
    border-radius: .6rem;
    font-size: 1.5rem;
    text-align: center;
    color: #FFFFFF;
  `
  export const RadioItem = styled.div<{ isClick: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .8rem 1.5rem;
    cursor: pointer;
    background: ${({isClick}) => isClick ? "#4E4597" : "#A8A4CC"};
    border-right: .1rem solid white;
  `
  export const BodySelector = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
  `
  export const ConfigText = styled.div`
    display: flex;
    position: relative;
    flex-direction: row;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 1.6rem;
    align-items: center;
    color: rgba(98, 98, 98, 0.8000);
    margin-right: .5rem;
  `

  export const Input = styled.div`
    position: relative;
    align-items: center;
    display: flex;
    flex-direction: row;
    background-color: #FAFBFE;
    border: .2rem solid #A8A4CC;
    border-radius: .6rem;
    width: 100%;
  `
  export const BalanceWrapper = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 1.4rem;
    color: #787878;
    display: flex;
    align-items: center;
    justify-content: end;
  `

  export const Balance = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 1.6rem;
    color: #4E4597;
  `


  export const InputText = styled.input`
    display: flex;
    border-radius: .6rem;
    height: 4.0rem;
    width: 100%;
    outline: none;
    padding-left: 1.0rem;
    color: #787878;

    ::placeholder {
      color: rgba(120, 120, 120, 0.6);
    }
  `

}
