import styled from "styled-components";

export namespace WebSiteStyles {
  export const WebSiteItemsWrapper = styled.div`
    background-color: #FFFFFF;
    border-radius: 1.8rem;
    display: flex;
    flex-wrap: wrap;
    padding: 3.9rem 2.0rem;
    gap: 4.0rem;
    flex: 1
  `

  export const NonWebSiteItemsWrapper = styled.div`
    flex: 1;
    background: #FFFFFF;
    border-radius: 1.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 2.0rem .0rem;
  `

  export const WebSiteItemPlusWrapper = styled.div`
    border-radius: 1.2rem;
    border-color: #EDEEEE;
    border-style: dashed;
    border-width: .2rem;
    cursor: pointer;
    width: 33.6rem;
    height: 19.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  `
  export const WebSiteItemPlus = styled.div`
    border-radius: 1.2rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 10;
    font-size: 8.0rem;
    line-height: 8.8rem;
    color: #787878;
  `
  export const ContentWrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
  `

  export const TitleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: 4.8rem;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.0rem;
  `
  export const Text_L = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.5rem;
    color: #292929;
    padding-right: 2.0rem;
  `
  // export const Text_M = styled.div<{ x: Number; y: Number }>`
  export const Text_M = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 3.6rem;
    line-height: 4.4rem;
    color: #000000;
    padding-right: 1.0rem;
  `
  // export const Text_S = styled.div<{ x: Number; y: Number }>`
  export const Text_S = styled.div`
    align-self: flex-end;
    height: 4.0rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 2.4rem;
    line-height: 2.9rem;
    color: #787878;
    padding-right: 1.0rem;
  `
  // export const Text_S_P = styled.div<{ x: Number; y: Number; w?: Number }>`
  export const Text_S_P = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 2.1rem;
    line-height: 2.5rem;
    color: #4E4597;
  `
  // export const Text_SS = styled.div<{ x: Number; y: Number; w?: Number}>`
  export const Text_SS = styled.div`
    height: 6.0rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 1.8rem;
    line-height: 3.0rem;
    color: #787878;
    padding-right: 1.0rem;
  `

  export const Main = styled.div`
    width: 100%;
    display: flex;
  `
}
