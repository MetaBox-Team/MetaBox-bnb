import React, {useCallback, useEffect, useState} from 'react';
import {NotifyTopStyles as Styled} from "@/views/Sider/NotifiyTop/styles";
import {desensitizationPrincipal} from "@/utils/formate";
import {MBApi, RequestApi, UnhandledEmail} from "@/api";
import {Principal} from "@dfinity/principal";
import {useAuth} from "@/usehooks/useAuth";
import {toast} from "react-toastify";
import {Profile__1} from '@/did/model/Profile';
import Tooltip from "antd/es/tooltip";
import {toast_api} from "@/utils/T";
import {AvatarInfo} from "@/views/Sider/SimpleComponents";


export const UnhandledItem = React.memo(({
                                           v,
                                           k,
                                           openSelect,
                                           info,
                                         }: { v: UnhandledEmail, k: number, openSelect: Function, info?: Profile__1 }) => {
  const [hoverOne, setHoverOne] = useState(-1)
  const {principal} = useAuth()

  const acceptBox = React.useCallback(async () => {
    if (!principal) return 0
    const canister_id = v.share_value
    const res = await MBApi.getBoxState(canister_id) as any
    if (Object.keys(res)[0] === "ok") {
      const owner = res.ok.owner as Principal
      const accept = () => {
        return new Promise(async (resolve, reject) => {
          const res = await Promise.all([RequestApi.handleEmail(principal, {
            unhandled_email: v,
            operation: "Accept"
          }), MBApi.acceptSharedBox(canister_id, owner.toString())])
          if (Object.keys(res[0])[0] === "ok" && res[1] === "ok") return resolve("ok")
          else return reject("")
        })
      }
      toast_api(accept, canister_id, "accept share").then(() => {
        MBApi.getBoxes(principal)
        RequestApi.getUnHandle(principal)
      })
    } else toast.error("state error")
  }, [principal, v])

  const handle = React.useCallback(async () => {
    if (!principal) return 0
    await RequestApi.handleEmail(principal, {
      unhandled_email: v,
      operation: "Accept"
    })
    RequestApi.getUnHandle(principal)
  }, [principal, v])

  const cancel_shared = () => {
    return new Promise(async (resolve, reject) => {
      const removeSharedBoxRes = await MBApi.removeSharedBox(Principal.from(v.share_value), Principal.from(v.from))
      handle().then()
      if (Object.keys(removeSharedBoxRes)[0] === "ok") resolve("ok")//@ts-ignore
      else reject(String(Object.keys(removeSharedBoxRes.err)[0]))
    })
  }

  const delete_shared_box = async () => {
    toast_api(cancel_shared, v.description, "unshared").then(() => MBApi.getBoxes(principal))
  }

  const handleConfirm = React.useCallback(async () => {
    if (v.share_type === "Box") {
      acceptBox().then()
    } else if (v.share_type === "File") {
      openSelect(v)
    } else if (v.share_type === "Transfer") {
      handle().then()
    } else if (v.share_type === "cancel_file") {
      handle().then()
    } else if (v.share_type === "cancel_box") {
      delete_shared_box().then()
    }
  }, [acceptBox, handle, delete_shared_box, openSelect, v, principal])


  const handleCancel = React.useCallback(async () => {
    if (principal) {
      const res = await RequestApi.handleEmail(principal, {
        unhandled_email: v,
        operation: "Refuse"
      })
      if (Object.keys(res)[0] === "ok") RequestApi.getUnHandle(principal).then()
      else toast.error("failed")
    }
  }, [principal])

  return <>
    <Styled.StreamItemWrap onMouseEnter={() => setHoverOne(k)} onMouseLeave={() => setHoverOne(-1)} key={k}
                           isRead={false}>
      <AvatarInfo url={info?.avatar_url}/>
      <Styled.InfoWrap>
        <HeadLine v={v} info={info}/>
        <div style={{width: "100%", paddingTop: "5px", display: hoverOne === k ? "block" : "none"}}>
          <Tip v={v}/>
          <Button v={v} handleConfirm={handleConfirm} handleCancel={handleCancel}/>
        </div>
      </Styled.InfoWrap>
    </Styled.StreamItemWrap>
  </>
})

const HeadLine = React.memo(({info, v}: { info?: Profile__1, v: UnhandledEmail }) => {
  return <Styled.SubInfoWrap>
    {info && <Styled.Text_name>
      {info.name.length > 10 ? desensitizationPrincipal(info.name, 4) : info.name}&nbsp;
    </Styled.Text_name>}
    <Styled.Text_S>{v.headline}</Styled.Text_S>
  </Styled.SubInfoWrap>
})

const Tip = React.memo(({v}: { v: UnhandledEmail }) => {
  return <Tooltip title={v.description}>
    <Styled.FileInfoWrap>{v.description}</Styled.FileInfoWrap>
  </Tooltip>
})

const Button = React.memo(({
                             handleConfirm,
                             handleCancel,
                             v
                           }: { v: UnhandledEmail, handleConfirm: React.MouseEventHandler<HTMLDivElement>, handleCancel: React.MouseEventHandler<HTMLDivElement> }) => {
  return <Styled.ButtonWrap>
    <Styled.ButtonItemWrap
      onClick={handleConfirm}>{v.share_type === "cancel_box" ? "delete the box" : "confirm"}</Styled.ButtonItemWrap>
    &nbsp;                  &nbsp;
    <Styled.ButtonItemWrap style={{display: v.share_type === "Box" || v.share_type === "File" ? "flex" : "none"}}
                           onClick={handleCancel}>refuse</Styled.ButtonItemWrap>
  </Styled.ButtonWrap>
})

