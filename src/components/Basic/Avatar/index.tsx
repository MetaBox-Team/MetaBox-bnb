import React from "react"
import {AvatarStyles as Styled} from "./styles"

interface Props {
  height?: string
  width?: string
  url?: string
}

export const Avatar = React.memo(({height, width, url}: Props) => {
  return <Styled.AvatarWrap
    width={width}
    url={url}
    height={height}/>
})
