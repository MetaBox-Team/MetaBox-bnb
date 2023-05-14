import styled from "styled-components";

export namespace LoginStyles {
  export const Top = styled.div`
    position: absolute;
    width: 50.0rem;
    height: 20.0rem;
    background: #F2F8FE;
    border-radius: 1.6rem 1.6rem 0 0;
  `
  export const GapFlex = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
  `
  export const Input = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    background-color: white;
    border: .2rem solid #A8A4CC;
    border-radius: .6rem;
    height: 90%;
    width: 100%;
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
