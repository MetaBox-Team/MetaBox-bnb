import styled from "styled-components";

export namespace LoginStyles {
  export const Body = styled.div`
    display: flex;
    flex-direction: column;
    height: 22.0rem;

  `
  export const GapFlex = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
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
    color: rgba(98, 98, 98, 0.8000);
    /* identical to box height, or 150% */
    text-align: right;
    width: 8.0rem;
    margin-right: .5rem;
  `

  export const Input = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    background-color: #FAFBFE;
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
  export const InputText2 = styled.textarea`
    display: flex;
    border-radius: .6rem;
    height: 17.0rem;
    width: 100%;
    outline: none;
    padding: 1.0rem;
    color: #787878;

    ::placeholder {
      color: rgba(120, 120, 120, 0.6);
    }

    text-align: inherit;
    margin-top: .5rem;
  `

}
