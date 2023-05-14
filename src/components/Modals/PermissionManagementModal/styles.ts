import styled from "styled-components";

export namespace LoginStyles {
  export const Body = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 35.0rem;
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
  export const Items = styled.div`
    display: flex;
    height: 20.0rem;
    flex-flow: column;
    padding: 1.0rem 0 0 0;
    border: .1rem solid #4E4597;
    border-radius: 1.0rem;
    background: #FAFBFE;
    overflow-y: auto;

    ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
      border-radius: 1.0rem;
      background: #4E4597;

    }

    ::-webkit-scrollbar { /*滚动条整体样式*/
      width: .8rem; /*高宽分别对应横竖滚动条的尺寸*/
      height: .2rem;
      padding-top: 200.0rem;
    }

    ::-webkit-scrollbar-track { /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 .5rem rgba(0, 0, 0, 0.2);
      border-radius: 1.0rem;
      background: #EDEDED;
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
  `
  export const End = styled.div`
    text-align: center;
    color: rgba(120, 120, 120, 0.83);
    margin-bottom: 1.0rem;
  `
  export const Group = styled.div`
    border-bottom: .1rem solid #EDEEEE;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.6rem;
    line-height: 2.5rem;
    color: rgba(169, 169, 169, 1.2);
    height: 20%;
    display: flex;
    align-items: center;
    padding-bottom: 2.0rem;
    padding-top: 2.0rem;
    padding-left: 1.0rem;

  `
  export const BottomText = styled.div`

    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.7rem;
    line-height: 2.5rem;
    color: rgba(169, 169, 169, 0.8);
    height: 10%;
    display: flex;
    justify-content: center;
    margin-top: 2.0rem;
    margin-bottom: 2.0rem;
  `
  export const RoleShared = styled.div`
    background: rgba(0, 148, 255, 0.2);

    border-radius: 4.0rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 2.9rem;
    color: #1575E6;
    text-align: center;
    width: 17%;
  `
  export const RoleOwner = styled.div<{ isHover?: boolean }>`
    background: ${({isHover}) => isHover ? "red" : " #FDEBED"};
    border-radius: 4.0rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 2.9rem;
    color: ${({isHover}) => isHover ? "white" : "rgba(236, 58, 78, 0.9)"};
    text-align: center;
    width: 17%;
  `
  export const CurrentRole = styled.div`
    height: 18%;
    display: flex;
    flex-direction: row;
    align-items: center;
  `
  export const TopText = styled.div`
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
  export const Invite = styled.div`
    height: 6.7rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  `
  export const InviteText = styled.input`
    padding-left: 2.0rem;
    width: 75%;
    height: 100%;
    background: #FAFBFE;
    border: .1rem solid #4E4597;
    border-radius: .5rem;
    margin-right: 5%;

    :focus {
      border: .1rem solid #4E4597;
    }
  `
}
