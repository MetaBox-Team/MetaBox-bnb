import styled from "styled-components";

export const Column = styled.div<{ alignItems?; justifyContent? }>`
  display: flex;
  align-items: ${({alignItems}) => alignItems || "center"};
  justify-content: ${({justifyContent}) => justifyContent || "center"};
  flex-direction: column;
`;
export const CommonWrap = styled.div<{ width?: number }>`
  width: ${({width}) => width || 480.}rem;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 5.8rem;
`;
export const Box = styled("div")<{
  width?: number | string;
  height?: number | string;
  d?: string;
  ai?: string;
  jc?: string;
}>`
  width: ${({width}) => width || "auto"};
  height: ${({height}) => height || "auto"};
  display: flex;
  flex-direction: ${({d}) => d || "row"};
  align-items: ${({ai}) => ai || "initial"};
  justify-content: ${({jc}) => jc || "initial"};
`;
export const HelveticaWrap = styled.div<{ size?: number; color?: string }>`
  font-family: Helvetica, serif;
  font-style: normal;
  font-weight: normal;
  font-size: ${({size}) => (size ? size : 2)}rem;
  line-height: 3.2rem;
  color: ${({color}) => (color ? color : "#333333")};
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const OPPOSansWrap = styled.div<{ size?: number; color?: string }>`
  font-family: OPPOSans;
  font-style: normal;
  font-weight: normal;
  font-size: ${({size}) => (size ? size : 2)}rem;
  line-height: 3.2rem;
  color: ${({color}) => (color ? color : "##999999")};
`;

export const ToastTextWrap = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 800;
  font-size: 1.6rem;
`

export const Scrollbar = styled.div`
  flex-grow: 1;
  flex-basis: .0rem;
  overflow-y: auto;
  scrollbar-width: flex;
  -ms-overflow-style: ${() => "flex"};

  ::-webkit-scrollbar {
    display: flex;
  }

  ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 2.5rem;
    background: #4E4597;
    box-shadow: .0rem .1rem .1rem rgba(78, 69, 151, 0.3);
  }

  ::-webkit-scrollbar { /*滚动条整体样式*/
    width: .8rem; /*高宽分别对应横竖滚动条的尺寸*/
  }

  ::-webkit-scrollbar-track { /*滚动条里面轨道*/
    -webkit-box-shadow: inset .0rem .0rem .6rem #A5C6E7;
    border-radius: 1.0rem;
    background: #F2F8FE;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

`
export const Tag = styled.div<{ isOwner: boolean }>`
  position: absolute;
  width: 4.5rem;
  top: 0;
  left: 0;
  height: 2.1rem;
  padding: 1rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({isOwner}) => isOwner ? "#fdebed" : "#C9E5FF"};
  color: ${({isOwner}) => isOwner ? "#EC3A4E" : "#0094FF"};
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: .9rem;
  border-radius: .3rem;
`


export const PublicTag = styled(Tag)`
  background: greenyellow;
  color: green;
`
