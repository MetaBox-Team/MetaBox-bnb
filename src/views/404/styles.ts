import styled from "styled-components";

export namespace NotFoundStyles {
    export const MainContainer = styled.div`
      flex: 1;
      background: #F2F8FE;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `
    export const ContainerPic = styled.div`
      width: 61.0rem;
      height: 42.5rem;
      background: url("/404.png");
      background-size: cover;
    `
}
