import styled from "styled-components";

export namespace LoginStyles {
  export const Body = styled.div`
    display: flex;
    flex-direction: column;

  `

  export const GapFlex = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
  `

  export const BodySelector = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
  `
  export const ConfigText = styled.div`
    display: flex;
    position: relative;
    flex-direction: row;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 1.6rem;
    line-height: 3.6rem;
    color: #626262;
    /* identical to box height, or 150% */
    text-align: left;
    width: 100%;
    margin-right: .5rem;
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
    width: 50%;
    outline: none;
    padding-left: 1.0rem;
    color: #787878;

    ::placeholder {
      color: rgba(120, 120, 120, 0.6);
    }
  `
  export const appendText = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: .6rem;
    line-height: 1.8rem;
    color: #969696;
  `

}
