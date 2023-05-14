import React, {useEffect, useState} from 'react';
import {NotifyTopStyles as Styled} from "@/views/Sider/NotifiyTop/styles";
import {desensitizationPrincipal} from "@/utils/formate";
import {RequestApi, ShareResponse} from "@/api";
import {useAuth} from "@/usehooks/useAuth";
import {toast} from "react-toastify";
import {Profile__1} from '@/did/model/Profile';
import {AvatarInfo} from "@/views/Sider/SimpleComponents";
import {useTranslation} from 'react-i18next';

export const ShareResponseItem = React.memo(({
                                               v,
                                               k,
                                               info,
                                             }: { v: ShareResponse, k: number, info?: Profile__1 }) => {
  const [hoverOne, setHoverOne] = useState(-1)
  const {principal} = useAuth()

  const handleConfirm = React.useCallback(async () => {
    try {
      if (principal) {
        const res = await RequestApi.handle_share_response(principal, v)
        if (Object.keys(res)[0] === "ok") RequestApi.get_share_response(principal).then()
        else toast.error("error")
      }
    } catch (e: any) {
      toast.error(e.message ? e.message : String(e))
    }
  }, [principal, v])

  return <Styled.StreamItemWrap onMouseEnter={() => setHoverOne(k)} onMouseLeave={() => setHoverOne(-1)}
                                key={k} isRead={false}>
    <AvatarInfo url={info?.avatar_url}/>
    <Styled.InfoWrap>
      <HeadLine v={v} info={info}/>
      <div style={{width: "100%", paddingTop: "5px", display: hoverOne === k ? "block" : "none"}}>
        <Button handleConfirm={handleConfirm}/>
      </div>
    </Styled.InfoWrap>
  </Styled.StreamItemWrap>
})

const HeadLine = React.memo(({info, v}: { info?: Profile__1, v: ShareResponse }) => {
  const headLine = React.useMemo(() => {
    switch (v.share_type) {
      case "Box":
      case "File":
        return ` your ${v.share_type}`
      case "cancel_box":
      case "cancel_file":
        return ` your unshared message`
      default:
        return ` your ${v.share_type}`
    }
  }, [v])

  return <Styled.SubInfoWrap>
    {info && <Styled.Text_name>
      {info?.name.length > 10 ? desensitizationPrincipal(info?.name, 4) : info?.name}
    </Styled.Text_name>}
    &nbsp;
    <Styled.Text_S>{v.operation === "Accept" ? "Received" : "refused"}{headLine}</Styled.Text_S>
  </Styled.SubInfoWrap>
})

const Button = React.memo(({handleConfirm}: { handleConfirm: React.MouseEventHandler<HTMLDivElement> }) => {
  const {t} = useTranslation()
  return <Styled.ButtonWrap>
    <Styled.ButtonItemWrap onClick={handleConfirm}>Confirm</Styled.ButtonItemWrap>
  </Styled.ButtonWrap>
})

