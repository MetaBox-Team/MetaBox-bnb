import React, {useEffect, useState} from 'react';
import {NotifyTopStyles as Styled} from "@/views/Sider/NotifiyTop/styles";

export const AvatarInfo = React.memo(({url}: { url?: string }) => {
  const [URL, setUrl] = useState("")

  useEffect(() => {
    if (url) {
      fetch(url).then(e => {
        if (e.ok) setUrl(url)
        else setUrl("")
      })
    }
  }, [url])

  return <Styled.StreamItemWrapLeft>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Styled.Poi/>
      <Styled.Gap_lr size={"27px"}/>
      <Styled.ImgWrap url={URL}/>
    </div>
  </Styled.StreamItemWrapLeft>
})

