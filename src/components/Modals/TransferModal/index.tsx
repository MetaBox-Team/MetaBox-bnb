import {Modal} from 'antd';
import {LoginStyles as Styled} from "./styles";
import React, {useCallback, useEffect, useRef, useState} from 'react';
import "./index.css";
import {DataBoxApi, MBApi, RequestApi, UnhandledEmail} from "@/api";
import {useAuth} from "@/usehooks/useAuth";
import {get_principal} from '@/utils/common';
import {Principal} from "@dfinity/principal";
import {toast_api} from "@/utils/T";
import {useTranslation} from "react-i18next";
import {Footer} from "@/components/Modals/components";
import {BoxAllInfo} from "@/did/model/MBox";

export const TransferModal = React.memo(({open, setOpen, boxItem}: {
  open: boolean, setOpen: Function, boxItem?: BoxAllInfo
}) => {
  const [isError, setIsError] = useState(false)
  const inputRef1 = useRef(null)
  const [canister_id, setCanister_id] = useState("")
  const {principal} = useAuth()
  const {t} = useTranslation()

  const T = useCallback((a: string) => t(`Modal.TransferModal.${a}`), [])

  useEffect(() => {
    open && handleCancel()
  }, [open])

  const clean = () => {
    //@ts-ignore
    if (inputRef1.current) inputRef1.current.value = '';
    setIsError(false)
  }

  const handleCancel = () => {
    clean()
    setCanister_id("")
  }

  const transfer = (to: Principal) => {
    return new Promise(async (resolve, reject) => {
      if (boxItem) {
        const email: UnhandledEmail = {
          from: String(principal),
          headline: t("Notify.transfer_box"),
          description: "",
          share_type: "Transfer",
          share_value: boxItem.canister_id.toString(),
        }
        const databoxApi = DataBoxApi(boxItem.canister_id.toString())
        const TransferRes = await Promise.all([MBApi.transferDataboxOwner(boxItem.canister_id as any, to), databoxApi.transferOwner(to)])
        if (Object.keys(TransferRes[0])[0] === "ok") {
          if (Object.keys(TransferRes[1])[0] === "ok") {
            const res = await RequestApi.sendEmail(to, email)//@ts-ignore
            if (res.ok) return resolve("ok")
            else return reject("failed")
          } //@ts-ignore
          else reject(String(Object.keys(TransferRes[1].err)[0]))            //@ts-ignore
        } else reject(String(Object.keys(TransferRes[0].err)[0]))
      }
    })
  }

  const handleConfirm = React.useCallback(async () => {
    try {
      const to = await get_principal(canister_id)
      boxItem && toast_api(transfer(to), boxItem.box_name, "transfer").then(() => MBApi.getBoxes(principal))
      setOpen(false)
    } catch (e) {
      setIsError(true)
    }
  }, [canister_id, boxItem, principal])

  const close = React.useCallback(() => setOpen(false), [])

  return (
    <>
      <Modal
        maskClosable={false}
        key={'NormalOneInputModal'}
        wrapClassName={'NormalOneInputModal'}
        title={
          [<div style={{color: '#4E4597', textAlign: 'center', fontSize: 25}}
                key={"NormalOneInputModal"}>{T("title")}</div>]
        }
        width={"60rem"}

        footer={
          [
            <Footer key={"DeleteCanisterModalFooter"} clear={close} handleClick={handleConfirm}/>
          ]
        }
        open={open}
        closable={false}>
        <Styled.Body className='mainBody'>
          <div style={{display: 'flex', width: '100%'}}>
            <Text T={T}/>
            <div style={{width: '2rem'}}/>
            <Input T={T} setCanister_id={setCanister_id} isError={isError} inputRef1={inputRef1}/>
          </div>
        </Styled.Body>
      </Modal>
    </>
  );
})

const Text = React.memo(({T}: { T: Function }) => <Styled.TopText>{T("to") + ":"}</Styled.TopText>)

const Input = React.memo((props: { T, setCanister_id, inputRef1, isError }) => {
  return <div style={{position: "relative", flex: "1"}}>
    <InputText {...props}/>
    <ErrorText {...props}/>
  </div>
})

const InputText = React.memo((props: { T, setCanister_id, inputRef1 }) => {
  const {T, setCanister_id, inputRef1} = props
  return <Styled.InputText onChange={(e) => setCanister_id(e.target.value)} ref={inputRef1}
                           placeholder={T("input_placeholder")}/>
})

const ErrorText = React.memo((props: { T, isError }) => {
  const {T, isError} = props
  return <Styled.ErrorText style={{display: isError ? "flex" : "none"}}>{T("error")}</Styled.ErrorText>

})
