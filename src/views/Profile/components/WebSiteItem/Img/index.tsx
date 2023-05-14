import React from 'react';
import {WebSiteItemStyles as Styled} from "@/views/Profile/components/WebSiteItem/styles";
import {Link} from "@/did/model/Profile";

export const ImgComponent = React.memo(({link}: { link: Link }) => {
  const handleClick = React.useCallback(() => window.open(link.url), [link.url])
  return <Styled.ImgWrapper onClick={handleClick} url={link.image_url[0]}/>
})

