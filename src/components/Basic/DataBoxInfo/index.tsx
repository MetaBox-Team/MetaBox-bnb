import React, {useState} from "react";
import {DataBoxInfoStyles as Styled} from "./styles"
import {Avatar, UpdateBoxInfoModal} from "@/components";
import Icon from "@/icons/Icon";
import {BoxAllInfo} from "@/did/model/MBox";

interface Props {
  width?: string;
  height?: string;
  url?: string;
  box_name?: string
  is_need_icon?: boolean
  boxItem?: BoxAllInfo
}

export const DataBoxInfo = React.memo((props: Props) => {
  const [open, setOpen] = useState(false)

  const handleClick = React.useCallback(() => {
    setOpen(true)
  }, [])
  return (
    <Styled.ItemLeft>
      <UpdateBoxInfoModal open={open} setOpen={setOpen} boxItem={props.boxItem}/>
      <Avatar_1 {...props}/>
      <Info {...props} handleClick={handleClick}/>
    </Styled.ItemLeft>
  );
})

const Avatar_1 = React.memo((props: { width?: string, height?: string, url?: string }) => {
  return <Avatar width={props.width} height={props.height} url={props.url}/>
})

const Info = React.memo((props: { box_name?: string, is_need_icon?: boolean, handleClick: React.MouseEventHandler<HTMLDivElement> }) => {
  return <Styled.ItemLeftInfo>
    <Styled.ItemLeftInfoName>
      {props.box_name}&nbsp;
      <div onClick={props.handleClick} style={{display: props.is_need_icon ? "flex" : "none", cursor: "pointer"}}><Icon
        name={"edit"} width={1.8}
        height={1.8}/>
      </div>
    </Styled.ItemLeftInfoName>
    <Styled.ItemLeftInfoDescription>Your own data Space</Styled.ItemLeftInfoDescription>
  </Styled.ItemLeftInfo>
})

