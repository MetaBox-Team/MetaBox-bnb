import styled from "styled-components";

export namespace TopUpStyles {
  export const Main = styled.div`
    width: 60.0rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.6rem 3.0rem 4.7rem 3.0rem;
    background-color: #ffffff;
    border: .1rem solid #e3e3e3;
    border-radius: .8rem;
    box-shadow: .8rem .8rem 1.5rem rgba(0, 0, 0, 0.1);
  `;

  export const HeadWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-bottom: .1rem gray solid;
    margin-bottom: 3.0rem;

  `;

  export const HeadText = styled.div`
    font-family: "Helvetica", serif;
    font-style: normal;
    font-weight: 400;
    font-size: 2.4rem;
    color: #333333;
  `

  export const HeadTagPageWrapper = styled.div`
    display: flex;
    width: 100%;
    padding-top: 1.0rem
  `
  export const HeadTagPageButton = styled.div<{ isClick?: boolean }>`
    font-family: "Helvetica", serif;
    font-style: normal;
    font-weight: 400;
    font-size: 1.6rem;
    color: #333333;
    margin-right: 2.0rem;
    cursor: pointer;
    padding: 1.0rem;
    border-radius: .5rem .5rem 0 0;
    background-color: ${({isClick}) => isClick ? "rgba(192, 192, 192, 0.4)" : "none"};

    :hover {
      background-color: rgba(192, 192, 192, 0.4)
    }
  `
  export const MiddleWrap = styled.div`
    height: 7.3rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
  `;

  export const TextWrap = styled.div`
    height: 2.1rem;
    display: flex;
    align-items: center;
    font-family: "Helvetica", serif;
    font-style: normal;
    font-weight: 400;
    font-size: 1.6rem;
    color: #999999;
  `;

  export const InputWrap = styled.input`
    width: 50.0rem;
    height: 4.2rem;
    border: .1rem solid #e3e3e3;
    box-sizing: border-box;
    border-radius: .8rem;
    padding-left: 1.4rem;
    font-family: "Helvetica", serif;
    font-style: normal;
    font-weight: 400;
    font-size: 1.6rem;
    color: #999999;

    :focus {
      border: .2rem solid #e3e3e3;
    }
  `;

  export const TipWrap = styled.div<{ isShow: boolean }>`
    height: 2.0rem;
    display: flex;
    visibility: ${({isShow}) => (isShow ? "visible" : "hidden")};
    align-items: center;
    font-family: "Helvetica", serif;
    font-style: normal;
    font-weight: 400;
    font-size: 1.4rem;
    color: #ff0000;
  `;

  export const FootWrap = styled.div`
    display: flex;
    width: 100%;
    padding-top: 2.0rem;
    justify-content: space-between;
  `;
  export const ButtonWrap = styled.button<{ isDisabled?: boolean }>`
    width: 12.7rem;
    height: 3.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Helvetica", serif;
    font-style: normal;
    font-weight: 400;
    border-radius: .4rem;
    background: #ffffff;
    font-size: 1.6rem;
    border: none;
    cursor: ${({isDisabled}) => isDisabled ? "not-allowed" : "pointer"};
  `;
}
