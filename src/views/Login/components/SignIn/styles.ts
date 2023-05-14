import styled from "styled-components";

export namespace SignInStyles {
  export const Center = styled.div`
    position: absolute;
    top: 15%;
    width: 84.1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 5.0rem;
    padding-bottom: 7.2rem;
    gap: 2.7rem;
    background: #FFFFFF;
    border-radius: 2.4rem;
  `

  export const InfoWrap = styled.div`
    height: 10.4rem;
    width: 57.2rem;
    background: #FFFFFF;
    border-radius: 1.2rem;
    z-index: 1;
    display: flex;
    padding: 1.2rem 20.0rem 1.2rem 1.2rem;
    align-items: center;
    filter: drop-shadow(.0rem .4rem 2.0rem rgba(126, 142, 185, 0.25));
  `

  export const ProfileAvatar = styled.div<{ imgUrl?: string }>`
    width: 10.713rem;
    height: 8.0rem;
    background: #9C9C9C;
    border-radius: 1.2rem;
    background: url(${({imgUrl}) => imgUrl ? imgUrl : "./avatar.jpg"}) no-repeat center center;
    background-size: cover;
  `

  export const ProfileInfo = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem;
  `

  export const Name = styled.div`
    height: 2.9rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 2.4rem;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
  `

  export const UID = styled.div`
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

  export const InputWrap = styled.div<{ isHover: boolean }>`
    position: relative;
    padding-left: 2.7rem;
    width: 57.2rem;
    border-radius: 1.2rem;
    height: 8.9rem;
    border: .1rem solid #C8D3F5;
    background: #FFFFFF;
    z-index: 5;
  `
  export const ErrorTip = styled.div`
    height: 3rem;
    position: absolute;
    top: 3.8rem;
    right: 1rem;
    color: red;
  `

  export const Input = styled.input`
    height: 100%;
    width: 100%;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 2.7rem;
    color: #787878;

    ::placeholder {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 2.7rem;
      color: #787878;
      opacity: 0.6;
    }
  `
  export const Welcome = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 5.0rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #4E4597;
  `

  export const SignInButton = styled.div`
    width: 57.2rem;
    height: 6.6rem;
    background: #4E4597;
    border-radius: 1.2rem;
    display: flex;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.7rem;
    color: #FFFFFF;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    :hover {
      transition: all 0.25s;
      opacity: 0.6;
      box-shadow: 0.2rem 0.2rem 0.8rem 0.2rem rgba(0, 0, 0, 0.3);
    }
  `

  export const ResetButton = styled(SignInButton)`
    width: auto;
    height: auto;
    background-color: white;
    color: rgba(0, 0, 0);

    :hover {
      opacity: 1;
      box-shadow: none;
      color: rgba(0, 0, 0, 0.5);
    }
  `

  export const TipText = styled.div`
    width: 50rem;
    font-family: 'Inter';
    text-align: center;
    font-style: normal;
    font-weight: 200;
    font-size: 1.5rem;
    color: darkred;
  `
}
