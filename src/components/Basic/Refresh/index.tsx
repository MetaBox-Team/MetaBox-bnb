import React, {useState} from 'react';
import Icon from "@/icons/Icon";
import {RefreshStyles as Styled} from "./styles"

interface Props {
  handleRefresh?: Function
  width?: number,
  height?: number
}

export const Refresh = React.memo(({handleRefresh, width, height}: Props) => {
  const [spin, setSpin] = useState(false)
  const handleClick = async () => {
    setSpin(true)
    await handleRefresh?.()
    setSpin(false)
  }

  return <Styled.Refresh spin={spin} onClick={handleClick}>
    <Icon name={"refresh"} width={width} height={height}/>
  </Styled.Refresh>
})

