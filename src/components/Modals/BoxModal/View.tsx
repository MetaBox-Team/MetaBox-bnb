import React, {MouseEventHandler} from 'react';
import {Footer} from "@/components/Modals/components";
import {Form, Modal, Switch, Upload} from "antd";
import {LoginStyles as Styled} from "./styles";
import {useTranslation} from "react-i18next";
import ImgCrop from "antd-img-crop";
import {beforeUpload, onPreview} from "@/utils/common";
import {UploadChangeParam, UploadFile} from "antd/es/upload/interface";

interface Props {
  title: string,
  handleClick: MouseEventHandler<Element>,
  clear: MouseEventHandler<Element>,
  open: boolean,
  setName: Function
  fileList: UploadFile[],
  onChange: ((info: UploadChangeParam<UploadFile<any>>) => void) | undefined,
  inputRef1: React.MutableRefObject<null>,
  isPrivate: boolean,
  setPrivate: Function
}

export const View = React.memo((props: Props) => {
  const {title, handleClick, clear, open, setName, setPrivate, inputRef1, isPrivate} = props
  const {t} = useTranslation()

  const T = React.useCallback((a: string) => t(`Modal.CreateBoxModal.${a}`), [t])

  return <Modal
    maskClosable={false}
    key={'creatBox'}
    wrapClassName={'creatBox'}
    title={
      [<div style={{color: '#4E4597', textAlign: 'center', fontSize: 25}}
            key={"CreateBoxModalTitle"}>{T(title)}</div>]
    }
    width={"60rem"}

    footer={
      [
        <Footer key={"CreateBoxModalFooter"} handleClick={handleClick} clear={clear}/>
      ]
    }
    open={open}
    closable={false}
  >
    <UploadAvatar T={T} {...props}/>
    <Item1 T={T} setName={setName} inputRef1={inputRef1}/>
    <Item2 T={T} isPrivate={isPrivate} setPrivate={setPrivate}/>
  </Modal>

})

export const UploadAvatar = React.memo((props: { T, fileList, onChange }) => {
  const {T} = props
  return <Form.Item
    label={[<label>{T("avatar")}</label>]}
    name={"avatar"}
    colon={false}>
    <ImgCrop_1 {...props}/>
  </Form.Item>
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
export const Item1 = React.memo((props: { T: Function, inputRef1: React.MutableRefObject<null>, setName: Function }) => {
  const {T, inputRef1, setName} = props
  return <Form.Item
    label={[<label>{T("name")}</label>]}
    name={"name"}
    colon={false}>
    <Styled.Input>
      <Styled.InputText ref={inputRef1} placeholder={T("input_placeholder")}
                        onChange={e => setName(e.target.value)}/>
    </Styled.Input>
  </Form.Item>
})

export const Item2 = React.memo((props: { T: Function, isPrivate: boolean, setPrivate: Function }) => {
  const {T, isPrivate, setPrivate} = props
  return <Form.Item
    label={T("private")}
    name={"private"}
    colon={false}>
    <Switch checked={isPrivate} onChange={e => setPrivate(e)}/>
  </Form.Item>
})
