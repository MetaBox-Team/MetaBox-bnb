import React, {useState} from 'react';
import {Modal} from "antd";
import {Footer} from "@/components/Modals/components";
import {LoginStyles as Styled} from "@/components/Modals/SelectBoxModal/styles";
import {Avatar, Gap} from "@/components";
import Icon from "@/icons/Icon";
import {useBoxesStore} from "@/redux";
import {BoxAllInfo, BoxInfo__1} from "@/did/model/MBox";
import {useTranslation} from "react-i18next";

interface Props {
  boxItem?: BoxInfo__1
  open: boolean
  handleCancel: React.MouseEventHandler<Element>
  handleConfirm: React.MouseEventHandler<Element>
  whichBox: string
  setWhichBox: Function
}

export const View = React.memo((props: Props) => {
  const {open, handleCancel, handleConfirm, whichBox, setWhichBox, boxItem} = props
  const {t} = useTranslation()
  const [isShow, setIsShow] = useState(false)

  const placeholder = React.useMemo(() => !!whichBox ? whichBox : t(`Modal.SelectBoxModal.${boxItem ? "input_placeholder_2" : "input_placeholder"}`), [boxItem, whichBox, t])


  return <>
    <Modal
      maskClosable={false}
      key={'creatBox2'}
      wrapClassName={'creatBox2'}
      title={
        [<div style={{color: '#4E4597', textAlign: 'center', fontSize: 25}}
              key={"CreateBox2ModalTitle"}>{t("Modal.SelectBoxModal.title")}</div>]
      }
      width={"70rem"}

      footer={
        [
          <Footer key={"CreateBox2ModalFooter"} clear={handleCancel} handleClick={handleConfirm}/>
        ]
      }
      open={open}
      closable={false}
    >
      <Styled.Body>
        <Styled.BodySelector className={'creatBox2Selector'}>
          <Styled.IcpAmount>
            <Input placeholder={placeholder} whichBox={whichBox}/>
            <Gap width={20}/>
            <ShowIcon isShow={isShow} setIsShow={setIsShow}/>
            <Gap width={15}/>
            <Main isShow={isShow} setIsShow={setIsShow} setWhichBox={setWhichBox} boxItem={boxItem}/>
          </Styled.IcpAmount>
        </Styled.BodySelector>
      </Styled.Body>
    </Modal>
  </>
})

const Input = React.memo(({placeholder, whichBox}: { placeholder: string, whichBox: string }) => {
  return <Styled.IcpAmountNum placeholder={placeholder} value={whichBox}/>
})

const ShowIcon = React.memo(({isShow, setIsShow}: { isShow: boolean, setIsShow: Function }) => {

  return <div style={{cursor: "pointer"}} onClick={() => setIsShow(!isShow)}>
    <Icon name={"bottomArrow"} color={"#787878"} height={3} width={2}/>
  </div>
})

const Avatar_1 = React.memo(() => <Avatar width={"3.0rem"} height={"3.0rem"}/>)

const Main = React.memo((props: { isShow: boolean, setWhichBox: Function, setIsShow: Function, boxItem?: BoxInfo__1 }) => {
  const {isShow, boxItem} = props
  const {boxes} = useBoxesStore()

  const arr = React.useMemo(() => {
    if (boxItem) {
      const box_id = boxItem.canister_id.toString()
      return boxes?.filter(e => e.canister_id.toString() !== box_id)
    } else return boxes
  }, [boxes, boxItem])

  return <Styled.DropdownWrap style={{display: isShow ? "flex" : "none"}}>
    {arr?.map((v, k) => {
      return <Item key={k} {...props} v={v}/>
    })}
  </Styled.DropdownWrap>
})

const Item = React.memo((props: { v: BoxAllInfo, setWhichBox: Function, setIsShow: Function }) => {
  const {v, setIsShow, setWhichBox} = props
  return <Styled.DropdownItem onClick={() => {
    setWhichBox(v.canister_id.toString())
    setIsShow(false)
  }}>
    <Avatar_1/>
    &nbsp;&nbsp;&nbsp;
    <div style={{color: "#787878", fontSize: "2.5rem"}}>{v.box_name}</div>
  </Styled.DropdownItem>
})


