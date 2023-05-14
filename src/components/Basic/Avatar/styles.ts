import styled from "styled-components"

export namespace AvatarStyles {
  export const AvatarWrap = styled.div<{ width?: string; height?: string, url?: string }>`
    min-width: ${({width}) => width || "12.8rem"};
    min-height: ${({height}) => height || "12.8rem"};
    max-height: ${({height}) => height || "12.8rem"};
    max-width: ${({width}) => width || "12.8rem"};
    border-radius: 50%;
    background: url(${({url}) => !!url ? url : "./Doge-meme-2.webp"}) no-repeat center;
    background-size: cover;
  `
}
