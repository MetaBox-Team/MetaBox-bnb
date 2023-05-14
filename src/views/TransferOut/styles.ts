import styled from "styled-components";
export namespace CreateStyles {
  export const CreateWrap = styled.div`
    padding-top: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    width: 100%;
    background: #f7f7f7;
  `;
  export const TitleWrap = styled.div`
    font-family: Helvetica;
    font-style: normal;
    font-weight: bold;
    font-size: 42px;
    line-height: 56px;
    /* identical to box height */
    color: #000000;
  `;
  export const DescriptionWrap = styled.div`
    font-family: Helvetica;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 21px;
    /* Gray300 */
    color: #000000;
  `;
  export const InputWrap = styled.div`
    width: 400px;
  `;
}
