import styled, {keyframes} from "styled-components";

export namespace LoginStyles {
  export const Background = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    background: url("/Login.png") no-repeat center center;
    background-size: cover;
  `
  export const LoginWrap = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4.0rem;
  `


  export const LogoTest = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 3.6rem;
    color: #333333;

  `
  export const LogoWrap = styled.div`
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `

  export const Logo = styled.div`
    width: 7.7rem;
    height: 7.7rem;
    background: url("/logo.jpg");
    background-size: cover;
  `
  export const LoginHead = styled.div`
    position: absolute;
    top: 3.0rem;
    left: 3.0rem;
    height: 8.9rem;
    opacity: 1;
  `
  export const BackgroundImag = styled.div`
    width: 100%;
    height: 100%;
    background: url("/img_1.png") no-repeat center;
    position: absolute;
    opacity: 0.1;
  `

  const top_down_main = keyframes`
    from {
      transform: translateY(-3rem);
    }
    to {
      transform: translateY(2rem);
    }
  `

  export const LoadingImg = styled.div`
    position: relative;
    width: 35rem;
    z-index: 1;
    height: 35rem;
    background: url("/logo_main.jpg");
    background-size: cover;
    animation: ${top_down_main} 2s linear infinite;
    animation-direction: alternate;
  `

  export const LoadingItemBlue = styled.div`
    position: absolute;
    width: 16rem;
    height: 17rem;
    left: 10rem;
    top: 6.5rem;
    z-index: 3;
    background: url("/logo_item_blue.jpg");
    background-size: cover
  `

  const top_down = keyframes`
    from {
      top: -1.5rem
    }
    to {
      top: 2rem
    }
  `

  export const LoadingItemWhite = styled.div`
    position: absolute;
    width: 16rem;
    height: 18rem;
    left: -2rem;
    top: -1.5rem;
    z-index: 2;
    background: url("/logo_item_white.jpg");
    background-size: cover;
    animation: ${top_down} 1s linear infinite;
    animation-direction: alternate;
  `

}
