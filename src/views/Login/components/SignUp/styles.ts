import styled from "styled-components";

export namespace SignUpStyles {


  export const Center = styled.div`
    width: 84.1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.0rem;
    background: #FFFFFF;
    border-radius: 2.4rem;
    gap: 2.7rem;
    z-index: 1;
  `

  export const AvatarWrap = styled.div`
    width: 12.9rem;
    height: 12.9rem;
    border-radius: 50%;
    //border: .3rem dashed #C4C4C4;
    display: flex;
    justify-content: center;
    cursor: pointer;
    align-items: center;
  `

  export const TipWrap = styled.div`
    width: 18.9rem;
    height: 3.3rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 2.7rem;
    color: #787878;
    opacity: 0.6;
    display: flex;
    align-items: center;
  `

  export const InputWrap = styled.div<{ isRepeat?: boolean }>`
    padding-left: 2.7rem;
    width: 100%;
    height: 8.9rem;
    border-radius: 1.2rem;
    border: .1rem solid ${({isRepeat}) => isRepeat ? "#FD0606" : "#C8D3F5"};
    background: #FFFFFF;

    :hover {
      filter: drop-shadow(.0rem .4rem .4rem rgba(0, 0, 0, 0.25))
    }
  `
  export const Input = styled.input`
    height: 100%;
    width: 100%;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 2.7rem;

    ::placeholder {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 2.7rem;
      color: #787878;
      opacity: 0.6;
    }
  `

  export const ErrorText = styled.div`
    position: absolute;
    top: 3.0rem;
    right: 2.4rem;
    display: flex;
    align-items: center;
    font-family: 'Noto Sans CJK SC';
    font-style: normal;
    font-weight: 500;
    font-size: 1.8rem;
    color: #FD0606;
    opacity: 0.6;
  `

  export const Button = styled.div`
    width: 100%;
    height: 6.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 1.2rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.7rem;
    color: rgba(0, 0, 0, 0.2);

  `


}
