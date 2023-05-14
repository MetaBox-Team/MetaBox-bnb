import React, {useState} from 'react';
import {Gap} from "@/components";
import {SelectInputStyles as Styled} from "./styles"
import Icon from "@/icons/Icon";


interface Props {
  placeholder?: string
  item: string
  setItem: Function
  itemComponent: ((setIsShow: Function) => JSX.Element)[]
}

export const SelectInput = React.memo((props: Props) => {
  const [isShow, setIsShow] = useState(false)

  const {placeholder, item} = props
  return <Styled.IcpAmount>
    <Input placeholder={placeholder} item={item}/>
    <Gap width={20}/>
    <ShowIcon isShow={isShow} setIsShow={setIsShow}/>
    <Gap width={15}/>
    <Main isShow={isShow} setIsShow={setIsShow} {...props}  />
  </Styled.IcpAmount>
})


const Input = React.memo(({placeholder, item}: { placeholder?: string, item: string }) => {
  return <Styled.IcpAmountNum placeholder={placeholder} value={item}/>
})

const ShowIcon = React.memo(({isShow, setIsShow}: { isShow: boolean, setIsShow: Function }) => {

  return <div style={{cursor: "pointer"}} onClick={() => setIsShow(!isShow)}>
    <Icon name={"bottomArrow"} color={"#787878"} height={3} width={2}/>
  </div>
})

const Main = React.memo((props: { itemComponent: ((setIsShow: Function) => JSX.Element)[], isShow: boolean, setItem: Function, setIsShow: Function }) => {
  const {isShow, itemComponent} = props

  return <Styled.DropdownWrap style={{display: isShow ? "flex" : "none"}}>
    {itemComponent?.map((v) => {
      return v(props.setIsShow)
    })}
  </Styled.DropdownWrap>
})
