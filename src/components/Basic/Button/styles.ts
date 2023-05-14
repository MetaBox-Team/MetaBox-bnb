import styled from "styled-components";

export namespace ButtonStyles {
    export const ButtonWrap = styled.button<{
        height?: string;
        width?: string;
        disabled?: boolean;
        size?: number;
    }>`
      width: ${({width}) => (width ? width : `12.7rem`)};
      height: ${({height}) => (height ? height : `3.6rem`)};
      background: ${({disabled}) => (disabled ? "#F7F7F7" : "#0052ff")};
      color: ${({disabled}) => (disabled ? "#999999" : "#ffffff")};
      border-radius: .4rem;
      display: flex;
      border: none;
      align-items: center;
      justify-content: center;
      font-family: Helvetica, serif;
      font-style: normal;
      font-weight: normal;
      font-size: ${({size}) => (size ? size : "1.6rem")};
      line-height: 2.1rem;
      text-align: center;
      /* white */
      cursor: pointer;

      :hover {
        transition: box-shadow 0.15s;
        box-shadow: 0 .8rem .8rem 0 rgba(0, 0, 0, 0.2),
        0 .6rem 1.2rem 0 rgba(0, 0, 0, 0.19);
      }
    `;
}
