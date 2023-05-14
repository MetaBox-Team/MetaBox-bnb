import styled, {keyframes} from "styled-components";

export namespace LoginStyles {

  const rotate = keyframes`
    0% {
      letter-spacing: -0.5em;
      opacity: 0;
    }
    40% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  `;

  export const Body = styled.div`
    display: flex;
    flex-direction: row;
    height: 4.7rem;
    margin-bottom: 2.0rem;
    align-items: center;
    cursor: pointer;

    :hover {
      background-color: #F0F4FE;
    }
  `
  export const Avatar = styled.div<{ url?: string }>`
    background: #D9D9D9;
    height: 4.5rem;
    width: 4.5rem;
    border-radius: 50%;
    background: ${({url}) => !!url ? `url(${url})` : `url("https://avatars.githubusercontent.com/u/90884875?v=4")`};
    background-size: cover
  `
  export const Name = styled.div`
    display: flex;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.5rem;
    max-height: 100%;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.6);
  `
  export const RoleShared = styled.div<{ isHover: boolean }>`
    background: ${({isHover}) => isHover ? "red" : "rgba(0, 148, 255, 0.2)"};
    cursor: pointer;
    border-radius: 4.0rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 2.9rem;
    color: ${({isHover}) => isHover ? "white" : "#1575E6"};
    padding: 0 1.0rem;
    text-align: center;
    animation: ${rotate} 0.5s;


  `
  export const RoleOwner = styled.div`
    background: #FDEBED;
    border-radius: 4.0rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 2.9rem;
    color: rgba(236, 58, 78, 0.9);
    text-align: center;
    padding: 0 1.0rem;
    cursor: pointer;
  `

}
