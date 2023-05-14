import styled from "styled-components";

export namespace LoginStyles {
  export const Body = styled.div`
    display: flex;
    flex-direction: column;
  `
  export const BodySelector = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;

  `
  export const ConfigText = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.0rem;
    line-height: 3.6rem;
    color: rgba(98, 98, 98, 0.8000);
    /* identical to box height, or 150% */
    text-align: left;


  `

  export const DropdownItem = styled.div`
    min-height: 6.0rem;
    max-height: 6.0rem;
    display: flex;
    justify-content: space-between;
    background-color: #F2F8FE;
    align-items: center;
    padding: 0 1.0rem;
    cursor: pointer;
    border-bottom: .1rem solid #787878;

    :hover {
      background-color: #EDEEEE
    }
  `
  export const IcpAmount = styled.div`
    align-items: center;
    display: flex;
    background-color: #FAFBFE;
    border: .2rem solid #A8A4CC;
    border-radius: .6rem;
    height: 5.0rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  `
  export const Radio = styled.div`
    font-family: 'Inter';
    font-style: normal;
    display: flex;
    border-radius: .6rem;
    font-size: 1.5rem;
    text-align: center;
    color: #FFFFFF;
    margin: 2.0rem;
  `
  export const RadioItem = styled.div<{ isClick: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .8rem 1.5rem;
    cursor: pointer;
    background: ${({isClick}) => isClick ? "#4E4597" : "#A8A4CC"};
    border-right: .1rem solid white;
  `
  export const FileSelector = styled.div`

    font-family: 'Inter';
    display: flex;
    justify-content: center;
    align-items: center;
    border: .1rem solid #4E4597;
    margin-top: 1.5rem;
    font-style: normal;
    background-color: #FAFBFE;
    border-radius: .6rem;
    font-size: 1.5rem;
    text-align: center;
    color: rgba(0, 52, 114, 0.2);
    height: 10.0rem;
    width: 100%;
  `
  export const FileList = styled.div`
    font-family: 'Inter';
    display: flex;
    align-items: center;
    gap: 0 5.0rem;
    flex-wrap: wrap;
    margin-top: 1.5rem;
    height: 6.0rem;
    overflow: scroll;
    color: rgba(0, 52, 114, 0.5);
    scrollbar-width: none;
    -ms-overflow-style: none;

    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  `

  export const FileListItem = styled.div`
    height: 2.4rem;

  `

  export const IcpAmountNum = styled.input`
    display: flex;
    border-radius: .6rem;
    height: 100%;
    width: 100%;
    outline: none;
    padding-left: 1.0rem;
    color: #787878;

    ::placeholder {
      color: rgba(120, 120, 120, 0.6);
    }

  `

  export const IcpAmountBut = styled.div`
    display: flex;
    height: 4.0rem;
    flex-direction: row-reverse;
    padding-left: 2.0rem;
    padding-right: 2.0rem;
    align-items: center;
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 1.8rem;
    line-height: 2.9rem;
    text-align: right;
    color: rgba(120, 120, 120, 0.5);
  `
  export const Font = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row-reverse;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 1.5rem;
  `

  export const IcpBalance = styled(Font)`
    font-size: 1.2rem;
    color: rgba(120, 120, 120, 0.8);
  `
  export const IcpBalanceAmount = styled(Font)`
    font-family: 'Inter';
    font-style: normal;
    color: rgba(78, 69, 151, 0.8);
  `

}
