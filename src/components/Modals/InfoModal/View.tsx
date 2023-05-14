import React, {memo, useCallback} from 'react';
import {Footer} from "@/components/Modals/components";
import {LoginStyles as Styled} from "./styles";
import {Gap} from "@/components";
import ImgCrop from "antd-img-crop";
import {Modal, Upload} from "antd";
import {useTranslation} from "react-i18next";
import {UploadChangeParam, UploadFile} from "antd/es/upload/interface";
import {beforeUpload, onPreview} from "@/utils/common";

interface Props {
  handleConfirm: React.MouseEventHandler<Element>,
  handleCancel: React.MouseEventHandler<Element>,
  open: boolean,
  isCreateLink: boolean,
  fileList: UploadFile[],
  onChange: ((info: UploadChangeParam<UploadFile<any>>) => void) | undefined,
  inputRef1: React.MutableRefObject<null>,
  inputRef2: React.MutableRefObject<null>,
  old_name: string | undefined
  old_description: string | undefined
  handleInput: Function
}

export const View = memo((props: Props) => {
  const {
    handleCancel,
    handleConfirm,
    open,
    isCreateLink, old_description, old_name
  } = props;
  const {t} = useTranslation()

  const T = useCallback((a: string) => t(`Modal.CreateProfileWebsiteModal.${a}`), [t])
  return <Modal
    maskClosable={false}
    key={'CreateProfileWebsiteModal'}
    wrapClassName={'CreateProfileWebsiteModal'}
    title={
      [<div style={{color: '#4E4597', textAlign: 'center', fontSize: 25}}
            key={"CreateProfileWebsiteModalTitle"}>{isCreateLink && old_name === undefined && old_description === undefined ? T("title_1") : T("title_2")}</div>]
    }
    width={"60rem"}
    footer={
      [
        <Footer key={"CreateProfileWebsiteModalFooter"} handleClick={handleConfirm} clear={handleCancel}/>
      ]
    }
    open={open}
    closable={false}
  >
    <Styled.Body>
      <Styled.BodySelector className={'creatBox2Selector'}>
        <UploadAvatar T={T} {...props}/>
        <SetName T={T} {...props}/>
        <Gap height={10}/>
        <SetDescription T={T} {...props}/>
        <Gap height={15}></Gap>
      </Styled.BodySelector>
    </Styled.Body>
  </Modal>
})

const SetDescription = React.memo((props: { isCreateLink, old_description, inputRef2, handleInput, T }) => {
  const {isCreateLink, old_description, inputRef2, handleInput, T} = props
  return <Styled.GapFlex>
    <Text {...props} text_1={T("item_3_0")} text_2={T("item_3_1")}/>
    <Gap width={35}></Gap>
    <Styled.Input>
      <Styled.InputText ref={inputRef2}
                        onChange={e => handleInput(isCreateLink ? "name" : "description", e.target.value)}
                        placeholder={isCreateLink ? "Test" : old_description}/>
    </Styled.Input>
  </Styled.GapFlex>
})

const SetName = React.memo((props: { isCreateLink, old_name, inputRef1, handleInput, T }) => {
  const {isCreateLink, old_name, inputRef1, handleInput, T} = props
  return <Styled.GapFlex>
    <Text {...props} text_1={T("item_2_0")} text_2={T("item_2_1")}/>
    <Gap width={20}></Gap>
    <Styled.Input>
      <Styled.InputText ref={inputRef1}
                        onChange={e => handleInput(isCreateLink ? "url" : "name", e.target.value)}
                        placeholder={isCreateLink ? "Test" : old_name}/>
    </Styled.Input>
    {isCreateLink &&
      <Styled.appendText>e.g. https://www.example.com</Styled.appendText>}
  </Styled.GapFlex>
})

const UploadAvatar = React.memo((props: { isCreateLink, T, fileList, onChange }) => {
  const {T} = props
  return <Styled.GapFlex>
    <Text {...props} text_1={T("item_1_0")} text_2={T("item_1_1")}/>
    <Gap width={35}></Gap>
    <ImgCrop_1 {...props}/>
  </Styled.GapFlex>
})

const ImgCrop_1 = React.memo(({
                                fileList,
                                onChange,
                              }: { fileList, onChange }) => {
  return <ImgCrop rotate>
    <Upload
      listType="picture-card"
      fileList={fileList}
      onChange={onChange}
      onPreview={onPreview}
      beforeUpload={beforeUpload}>
      {fileList.length < 1 && '+ Upload'}
    </Upload>
  </ImgCrop>
})

const Text = React.memo(({isCreateLink, text_1, text_2}: { isCreateLink, text_1, text_2 }) => {
  return <Styled.ConfigText>
    {isCreateLink ? text_1 : text_2}
  </Styled.ConfigText>
})

