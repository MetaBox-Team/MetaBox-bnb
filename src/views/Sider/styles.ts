import styled from "styled-components";

export namespace SideStyles {
  export const Wrap = styled.div`
    width: 27.8rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #F2F8FE;
  `

  export const Top = styled.div`
    padding-top: 4rem;
    width: 100%;
    height: 10.7rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #C8D3F5;

  `

  export const BackHome = styled.div`
    display: flex;
    padding-left: 2.4rem;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 21px;
    color: #000000;
    cursor: pointer;

    :hover {
      color: #F2F8FE
    }
  `

  export const Button = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding: 0 0 3.5rem;
    background: #C8D3F5;

  `

  export const LogoWrap = styled.div`
    width: 100%;
    height: 6rem;
    display: flex;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 2.4rem;
    color: #000000;
    padding: 0 2.4rem;

  `
  export const Img = styled.div`
    background: url("/logo.jpg");
    background-size: cover;
    width: 6rem;
    height: 6rem;
  `
  export const EmptyItem = styled.div`
    height: 6.6rem;
    width: 100%;
    background: #C8D3F5;
  `

  export const Item = styled.div`
    padding-left: 2.4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #C8D3F5;
  `
  export const ItemWrap = styled.div<{ isClick: boolean }>`
    height: 6.6rem;
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 3.5rem;
    background: ${({isClick}) => isClick && "#F2F8FE"};
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 2.1rem;
    transition: background, color 0.2s;
    cursor: pointer;
    border-radius: ${({isClick}) => isClick ? " 3.3rem 0 0 3.3rem" : " 3.3rem "};
    color: ${({isClick}) => isClick ? "#000000" : "#F2F8FE"};
  `

  export const MyInfo = styled.div`
    position: relative;
    height: 6.0rem;
    width: 100%;
    display: flex;
    padding: 1.2rem;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.8rem;
    background: #FFFFFF;
    border-radius: 1.2rem;
    cursor: pointer;
    color: #000000;
    margin-bottom: 2.4rem;
  `

  export const MessagePoint = styled.div`
    width: 1.2rem;
    height: 1.2rem;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    top: 0;
    right: 0;
  `

  export const EmailIcon = styled.div`
    width: 3.6rem;
    height: 3.6rem;
    background: url("/img_3.png");
    background-size: cover;
  `

  export const SideButton = styled.div`
    width: 100%;
    height: 10.4rem;
    display: flex;
    background: #FFFFFF;
    border-radius: 1.2rem;
    padding: 1.2rem;
  `

  export const SideButtonImg = styled.div<{ url?: string }>`
    width: 8rem;
    height: 8rem;
    border-radius: 1.2rem;
    background: url(${({url}) => url ? url : "/avatar.jpg"}) no-repeat center center;
    background-size: cover;
  `
  export const InfoWrap = styled.div`
    flex: 1;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: start;
  `
  export const Name = styled.div`
    font-family: 'Inter';
    font-style: normal;
    height: 2.9rem;
    font-weight: 500;
    font-size: 2.4rem;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
  `

  export const ID = styled.div`
    height: 1.8rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 1.5rem;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
  `
}
