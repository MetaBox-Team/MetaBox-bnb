import styled from "styled-components";

export namespace LoginStyles {
  export const Body = styled.div`
    display: flex;
    flex-direction: column;
    height: 10.0rem;
    overflow-y: auto;

    ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
      border-radius: 1.0rem;
      -webkit-box-shadow: inset 0 0 .5rem rgba(0, 0, 0, 0.2);
      background: #4E4597;
    }

    ::-webkit-scrollbar { /*滚动条整体样式*/
      width: .8rem; /*高宽分别对应横竖滚动条的尺寸*/
      height: .1rem;
      padding-top: 200.0rem;
    }

    ::-webkit-scrollbar-track { /*滚动条里面轨道*/
      border-radius: 1.0rem;
      background: #EDEDED;
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
  `

  export const InputText = styled.input`
    display: flex;
    border-radius: .6rem;
    border: .1rem solid #4E4597;
    background: #ECECEC;
    height: 4.0rem;
    width: 70%;
    outline: none;
    padding-left: 1.0rem;
    color: #787878;

    ::placeholder {
      color: rgba(120, 120, 120, 0.6);
    }
  `
  export const ErrorText = styled.div`
    position: absolute;
    top: 25%;
    left: 50%;
    display: flex;
    import styled from "styled-components";

    export namespace LoginStyles {
      export const Body

    = styled . div \`  
    display: flex;
    flex-direction: column;
    height: 10.0rem;
    overflow-y: auto;
    ::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 1.0rem;
      -webkit-box-shadow: inset 0 0 .5rem rgba(0,0,0,0.2);
      background: #4E4597;
    }
    ::-webkit-scrollbar {/*滚动条整体样式*/
      width: .8rem;     /*高宽分别对应横竖滚动条的尺寸*/
      height: .1rem;
      padding-top: 200.0rem;
    }
    ::-webkit-scrollbar-track {/*滚动条里面轨道*/
      border-radius: 1.0rem;
      background: #EDEDED;
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
    \` export const InputText = styled . input \`  
    display: flex;
    border-radius: .6rem;
    border: .1rem solid #4E4597;
    background: #ECECEC;
    height: 4.0rem;
    width: 70%;
    outline:none;
    padding-left: 1.0rem;
    color: #787878;
    ::placeholder{
      color: rgba(120,120,120,0.6);
    }
    \` export const ErrorText = styled . div \`  
    position: absolute;
    top: 25%;
    left: 50%;
    display: flex;
    align-items: center;
    font-family: 'Noto Sans CJK SC';
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    color: #FD0606;
    opacity: 0.6;
    \` export const TopText = styled . div \`  
    width: 100%;
    text-align: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.0rem;
    line-height: 3.6rem;
    text-align: left;
    /* identical to box height, or 120% */
    color: #626262;
    \`

    }

    align-items: center;
    font-family: 'Noto Sans CJK SC';
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    color: #FD0606;
    opacity: 0.6;
  `

  export const TopText = styled.div`
    width: 100%;
    text-align: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.0rem;
    line-height: 3.6rem;
    text-align: left;
    /* identical to box height, or 120% */
    color: #626262;
  `

}
