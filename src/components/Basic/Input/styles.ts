import styled from "styled-components";

export const InputWrap = styled.div<{ error: boolean | undefined }>`
  font-family: Helvetica;
  font-style: normal;
  font-weight: normal;
  font-size: 1.6rem;
  line-height: 2.1rem;
  // text-align: center;

  /* Gray300 */
  width: 100%;
  height: 5.4rem;
  /* Gray400 */

  border: .1rem solid ${({error}) => (error ? "#ff9494" : "#e3e3e3")};
  box-sizing: border-box;
  border-radius: .8rem;
  padding: 0 1.8rem;
  display: flex;
  align-items: center;

  :focus {
    border: 0.2rem solid ${({error}) => (error ? "#ff9494" : "#e3e3e3")};
  }
`;
