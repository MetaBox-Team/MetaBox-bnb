import styled from "styled-components";

export namespace AnnouncementStyles {
  export const Body = styled.div`
    display: flex;
    flex-direction: column;
    height: 15.0rem;
    overflow-y: auto;
    padding: 0 2rem;

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
      -webkit-box-shadow: inset 0 0 .5rem rgba(0, 0, 0, 0.2);
      border-radius: 1.0rem;
      background: #EDEDED;
    }

  `
  export const Description = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter';
    font-style: normal;
    font-size: 1.7rem;
    text-align: center;
    color: #848484;
    height: 100%;
    border-top: 2.0rem;
  `
}
