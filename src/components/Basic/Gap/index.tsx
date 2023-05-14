import React from "react";
import {Space} from "./styles"

interface Props {
  height?: number,
  width?: number
}

export const Gap = React.memo(({height, width}: Props) => {
  return <Space width={width} height={height}/>
})
