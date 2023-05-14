import styled from "styled-components";

export namespace SelectInputStyles {
  export const Body = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: center;
  `
  export const BodySelector = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 70%;
  `

  export const IcpAmount = styled.div`
    align-items: center;
    display: flex;
    width: 100%;
    position: relative;
    background-color: #FAFBFE;
    border: .1rem solid #ECECEC;
    border-radius: .6rem;
  `

  export const DropdownWrap = styled.div`
    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: column;
    left: 0;
    top: 6.0rem;
    max-height: 20.0rem;
    overflow: auto;
    z-index: 100;
  `

  export const DropdownItem = styled.div`
    min-height: 6.0rem;
    max-height: 6.0rem;
    display: flex;
    background-color: #F2F8FE;
    align-items: center;
    padding: 0 1.0rem;
    cursor: pointer;
    border-bottom: .1rem solid #787878;

    :hover {
      background-color: #EDEEEE
    }
  `

  export const IcpAmountNum = styled.input`
    display: flex;
    border-radius: .6rem;
    height: 6.0rem;
    width: 100%;
    outline: none;
    padding-left: 1.0rem;
    color: #787878;
  `


}
