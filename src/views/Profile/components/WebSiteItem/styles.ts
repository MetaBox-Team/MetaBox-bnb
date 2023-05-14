import styled from "styled-components";

const randomImg = (minNum = 0, maxNum = 4): number => parseInt(String(Math.random() * (maxNum - minNum + 1) + minNum), 10);


export namespace WebSiteItemStyles {
  export const WebSiteItemWrapper = styled.div`
    background-color: #FFFFFF;
    border-radius: 1.8rem;
    display: flex;
    flex-direction: column;
    flex-grow: 0;
  `

  export const ImgWrapper = styled.div<{ url?: string }>`
    width: 33.6rem;
    height: 19.2rem;
    background: #D9D9D9;
    border-radius: 1.2rem;
    background: url(${({url}) => url ? url : `/link_img_${randomImg()}.png`}) no-repeat center;
    background-size: cover;
    cursor: pointer;
  `
  export const TitleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    font-family: 'Inter';
    font-style: normal;
    align-items: center;
    justify-content: space-between;
    font-weight: 800;
    font-size: 2.1rem;
    color: #000000;
    padding-top: 1.0rem;
  `

  export const IcoWrapper = styled.div`
    display: flex;
    align-items: center;
  `
  export const TextWrap = styled.div`
    font-family: 'Inter_Light';
    font-style: normal;
    font-weight: 400;
    font-size: 1.8rem;
    color: #787878;
  `
}
