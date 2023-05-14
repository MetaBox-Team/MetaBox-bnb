import React from 'react';
import Icon from "@/icons/Icon";
import {Tooltip} from "antd";
import copy from "copy-to-clipboard";

interface Props {
  content: string | any
}

export const CopyTip = React.memo(({content}: Props) => {
  const [text, setText] = React.useState("Copy")

  const copyText = (text) => {
    copy(String(text))
    setText("Copied!")

    setTimeout(() => {
      setText("Copy")
    }, 500)
  }
  return (
    <Tooltip title={text} getPopupContainer={e => e.parentNode as HTMLElement}>
      <div
        style={{cursor: "pointer", display: "flex", alignItems: "center"}}
        onClick={() => {
          copyText(content)
        }}>
        <Icon name="copy"/>
      </div>
    </Tooltip>
  );
})

