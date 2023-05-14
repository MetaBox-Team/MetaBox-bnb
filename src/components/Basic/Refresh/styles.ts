import styled, {keyframes} from "styled-components";

export namespace RefreshStyles {
  const rotate = keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(-360deg);
    }
  `;

  export const Refresh = styled.div<{ spin?: boolean }>`
    animation: ${({spin}) => spin && rotate} 2s linear infinite;
  `

}
