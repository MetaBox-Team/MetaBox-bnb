import React, {memo, useState} from 'react';
import {LoginStyles as Styled} from "@/components/Modals/SharedModal/styles";
import {Gap} from "@/components";
import {Modal} from "antd";
import {useTranslation} from "react-i18next";
import {Footer} from "@/components/Modals/components";

interface Props {
  open: boolean
  handleConfirm: React.MouseEventHandler<Element>,
  inputRef1: React.MutableRefObject<null>,
  handleInput: Function,
  isError: boolean,
  inputRef2: React.MutableRefObject<null>,
  close: React.MouseEventHandler<Element>
}

export const View = memo((props: Props) => {
  const {
    open,
    handleConfirm,
    close
  } = props
  const {t} = useTranslation()
  const T = (a: string) => t(`Modal.SharedModal.${a}`)

  return <Modal
    maskClosable={false}
    key={'SharedModal'}
    wrapClassName={'SharedModal'}
    title={
      [<div style={{color: '#4E4597', textAlign: 'center', fontSize: 25}}
            key={"SharedModalTitle"}>{T("title")}</div>]
    }
    width={"60rem"}

    footer={
      [
        <Footer key={"SharedModalFooter"} clear={close} handleClick={handleConfirm}/>
      ]
    }
    open={open}
    closable={false}>
    <Styled.Body>
      <Styled.BodySelector className={'creatBox2Selector'}>
        <Item_1 T={T} {...props}/>
        <Gap height={10}/>
        <Item_2 T={T} {...props}/>
      </Styled.BodySelector>
    </Styled.Body>
  </Modal>
})

const Item_2 = memo((props: { T, inputRef2, handleInput, isError }) => {
  const {T} = props
  return <Styled.GapFlex>
    <Text text={T("remark")}/>
    <Gap width={30}/>
    <Item_2_input {...props} placeholder={T("input_placeholder_2")}/>
  </Styled.GapFlex>
})


const Item_2_input = memo(({inputRef2, placeholder, handleInput}: { inputRef2, placeholder, handleInput }) => {
  return <Styled.Input>
    <Styled.InputText2 ref={inputRef2} placeholder={placeholder}
                       onChange={e => handleInput("description", e.target.value)}/>
  </Styled.Input>
})

const Item_1 = memo((props: { T, inputRef1, handleInput, isError }) => {
  const {T, isError} = props
  return <Styled.GapFlex>
    <Text text={T("who")}/>
    <Gap width={30}/>
    <Item_1_input {...props} placeholder={T("input_placeholder_1")}/>
    <ErrorText isError={isError} text={T("error")}/>
  </Styled.GapFlex>
})

const Text = memo(({text}: { text: string }) => {
  return <Styled.ConfigText>
    {text}
  </Styled.ConfigText>
})

const Item_1_input = memo(({inputRef1, placeholder, handleInput}: { inputRef1, placeholder, handleInput }) => {
  return <Styled.Input>
    <Styled.InputText ref={inputRef1} placeholder={placeholder}
                      onChange={e => handleInput("user_id", e.target.value)}/>
  </Styled.Input>
})


const ErrorText = memo(({isError, text}: { isError: boolean, text: string }) => {
  return <Styled.ErrorText style={{display: isError ? "flex" : "none"}}>{text}</Styled.ErrorText>

})
