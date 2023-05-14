import {Modal} from 'antd';
import {TransferUserIdStyles as Styled} from "./styles";
import React from 'react';
import "./index.css";
import {Footer} from "@/components/Modals/components";
import {useAuth} from "@/usehooks/useAuth";


export const TransferUserIdModal = React.memo(({
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
                key={"NormalDialogModalTitle"}>Tip</div>]
        }
        width={"60rem"}

        footer={
          [
            <Footer key={"NormalDialogModalFooter"} clear={handleConfirm}/>
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


const V1_url =
  "https://o6fpj-2yaaa-aaaao-aafnq-cai.ic0.app/page/transferuserid"
// "http://localhost:3000/page/transferuserid"
let v2_window: Window | null
const Content = React.memo(() => {
  const {principal} = useAuth()
  const handleClick = React.useCallback(() => {
    v2_window = window.open(V1_url)
    window.addEventListener("message", handler)
  }, [])

  const handler = (message: MessageEvent<any>) => {
    if (message.data.message === "Ready_transfer") {
      v2_window && v2_window.postMessage({type: "MetaBox_v2_transfer", message: String(principal)}, "*")
    } else if (message.data.type === "MetaBox_v1_userID_Transfer_complete") {
      window.removeEventListener("message", handler)
      location.reload()
    }
  }
  return <Styled.Body className='mainBody'>
    <Styled.Description>
      If you want to use V1 user ID, please click the button below to transfer it to V2
      <div style={{height: "2rem"}}/>
      <Styled.Button
        onClick={handleClick}>
        Please Click Here~
      </Styled.Button>
    </Styled.Description>
  </Styled.Body>
})

