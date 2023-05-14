import styled, {keyframes} from "styled-components";

export namespace HeaderStyles {
  export const Header = styled.div`
    height: 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem
  `
  export const HeaderIcon = styled.div<{ isNeed: boolean }>`
    height: 4.5rem;
    width: 4.5rem;
    display: flex;
    visibility: ${({isNeed}) => isNeed ? "visibility" : "hidden"};
    justify-content: start;
    align-items: center;
    cursor: pointer;
  `
  export const LanguageWrap = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 100
  `
  export const DropdownWrap = styled.div<{ isShow: boolean }>`
    z-index: 100;
    position: absolute;
    width: 100%;
    flex-direction: column;
    visibility: ${({isShow}) => isShow ? "visible" : "hidden"};
    opacity: ${({isShow}) => isShow ? 1 : 0};
    top: 100%;
    left: 0;
    border: 1px solid #cdcdcd;
    border-radius: 0.25rem;
    transition: all 0.4s
  `

  export const DropdownItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    height: 3.5rem;
    background-color: #f9f9fb;
    color: #4E4597;
    z-index: 20;

    :hover {
      background-color: #dcdcdc;
    }
  `

  export const ChangeText = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 2rem;
    color: #4E4597;
  `

}
