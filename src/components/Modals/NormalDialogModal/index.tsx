import {Modal} from 'antd';
import {LoginStyles as Styled} from "./styles";
import React from 'react';
import "./index.css";
import {Footer} from "@/components/Modals/components";

export const NormalDialogModal = React.memo(({
                                               open,
                                               setOpen,
                                               title,
                                               description,
                                               isLink,
                                               onCancel,
                                               onOK
                                             }: { open: any, setOpen: Function, title: string, description: string, isLink: boolean, onCancel?: Function, onOK?: Function }) => {

  const handleCancel = React.useCallback(() => {
    onCancel?.()
    setOpen(false)
  }, [onCancel])

  const handleConfirm = React.useCallback(() => {
    onOK?.()
    setOpen(false)
  }, [onOK])

  return (
    <>
      <Modal
        maskClosable={false}
        key={'NormalDialogModal'}
        wrapClassName={'NormalDialogModal'}
        title={
          [<div style={{color: '#4E4597', textAlign: 'center', fontSize: 25}}
                key={"NormalDialogModalTitle"}>{title}</div>]
        }
        width={"60rem"}

        footer={
          [
            <Footer key={"NormalDialogModalFooter"} clear={handleCancel} handleClick={handleConfirm}/>
          ]
        }
        open={open}
        closable={false}
      >
        <Content isLink={isLink} description={description}/>
      </Modal>
    </>
  );
})

const Content = React.memo((props: { isLink: boolean, description: string }) => {
  const {isLink, description} = props
  return <Styled.Body className='mainBody'>
    <Styled.Description isLink={isLink}
                        onClick={() => isLink && window.open(description)}>{description}</Styled.Description>
  </Styled.Body>
})

