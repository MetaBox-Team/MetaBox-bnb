import {Modal} from 'antd';
import {AnnouncementStyles as Styled} from "./styles";
import React from 'react';
import "./index.css";
import {Footer} from "@/components/Modals/components";
import Icon from "@/icons/Icon";

export const AnnouncementModal = React.memo(({
                                               open,
                                               setOpen,
                                             }: { open: any, setOpen: Function }) => {

  const handleConfirm = React.useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      <Modal
        maskClosable={false}
        key={'NormalDialogModal'}
        wrapClassName={'NormalDialogModal'}
        title={
          [<div style={{color: '#4E4597', textAlign: 'center', fontSize: 30}}
                key={"NormalDialogModalTitle"}>Announcement</div>]
        }
        width={"60rem"}

        footer={
          [
            <Footer key={"NormalDialogModalFooter"} handleClick={handleConfirm}/>
          ]
        }
        open={open}
        closable={false}
      >
        <Content/>
      </Modal>
    </>
  );
})

const Content = React.memo(() => {
  return <Styled.Body className='mainBody'>
    <Styled.Description>
      We are holding a Christmas event now, please follow our official twitter for more details...
      <div style={{
        color: "#1D9BF0",
        cursor: "pointer",
        display: 'flex',
        alignItems: 'center',
        width: "100%",
        justifyContent: 'space-between'
      }}
           onClick={() => window.open("https://twitter.com/MetaBox_IC")}>
        <Icon name={"Christmas_tree"}/> @MetaBox_IC<Icon name={"Christmas_tree"}/>
      </div>
    </Styled.Description>
  </Styled.Body>
})

