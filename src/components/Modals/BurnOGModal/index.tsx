import {Modal} from 'antd';
import {LoginStyles as Styled} from "./styles";
import React, {useCallback, useEffect, useRef, useState} from 'react';
import "./index.css";
import {useTranslation} from "react-i18next";
import {Footer} from "@/components/Modals/components";
import {OGApi} from '@/api/OGApi';
import {toast_api} from '@/utils/T';
import {useAuth} from "@/usehooks/useAuth";
import {BoxInfo__1} from "@/did/model/MBox";

export const BurnOgModal = React.memo(({open, setOpen}: {
  open: boolean, setOpen: Function, boxItem?: BoxInfo__1
}) => {
  const [isError, setIsError] = useState(false)
  const inputRef1 = useRef(null)
  const [to, setTo] = useState("")
  const {t} = useTranslation()
  const {principal} = useAuth()


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
  }


  const handleConfirm = React.useCallback(async () => {
    try {
      toast_api(OGApi.burn_OG(to, 1), "OG badge", "burn").then(() => {
        principal && OGApi.getOgNum(principal)
      })
      setOpen(false)
    } catch (e) {
      throw e
    }
  }, [to, principal])

  const close = React.useCallback(() => setOpen(false), [])

  return (
    <>
      <Modal
        maskClosable={false}
        key={'NormalOneInputModal'}
        wrapClassName={'NormalOneInputModal'}
        title={
          [<div style={{color: '#4E4597', textAlign: 'center', fontSize: 25}}
                key={"NormalOneInputModal"}>{t("Modal.Burn.title")}</div>]
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
          <Text/>
          <Input setTo={setTo} isError={isError} inputRef1={inputRef1}/>
        </Styled.Body>
      </Modal>
    </>
  );
})

const Text = React.memo(() => {
  const {t} = useTranslation()
  return <Styled.TopText>{t("Modal.Burn.item_title")}</Styled.TopText>
})

const Input = React.memo((props: { setTo, inputRef1, isError }) => {
  return <div style={{position: "relative"}}>
    <InputText {...props}/>
    <ErrorText {...props}/>
  </div>
})

const InputText = React.memo((props: { setTo, inputRef1 }) => {
  const {t} = useTranslation()
  const {setTo, inputRef1} = props
  return <Styled.InputText onChange={(e) => setTo(e.target.value)} ref={inputRef1}
                           placeholder={`${t("Modal.Burn.placeholder")}`}/>
})

const ErrorText = React.memo((props: { isError }) => {
  const {isError} = props
  return <Styled.ErrorText style={{display: isError ? "flex" : "none"}}></Styled.ErrorText>

})

