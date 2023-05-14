import styled from "styled-components";

export namespace ButtonStyles {
  // export const ClickButton = styled.div<{ x: Number; y: Number; w: Number; h: Number }>`
  export const ClickButton = styled.div<{ padding: string }>`
    position: relative;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.9rem;
    background: #4E4597;
    padding: ${({padding}) => padding};
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.1rem;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0.0rem 0.0rem 0.0rem 0.0rem rgba(0, 0, 0, 0.2);
    opacity: 1;

    :hover {
      transition: all 0.25s;
      opacity: 0.6;
      box-shadow: 0.2rem 0.2rem 0.8rem 0.2rem rgba(0, 0, 0, 0.3);
    }

    :active {
      transition: all 0.08s;
      opacity: 0.8;
      box-shadow: 0.05rem 0.05rem 0.4rem 0.05rem rgba(0, 0, 0, 0.2);
    }
  `
}
