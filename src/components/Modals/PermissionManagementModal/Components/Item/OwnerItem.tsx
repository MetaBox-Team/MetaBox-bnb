import React, {useCallback, useEffect, useMemo, useState} from 'react'
import "./index.css"
import {Principal} from "@dfinity/principal"
import {DataBoxApi, MBApi, RequestApi, UnhandledEmail} from "@/api"
import {BoxAllInfo} from "@/did/model/MBox"
import {useAuth} from "@/usehooks/useAuth"
import {Profile__1} from "@/did/model/Profile"
import {toast_api} from "@/utils/T"
import {OtherItemView} from "@/components/Modals/components"
import {useTranslation} from "react-i18next";

export const OwnerItem = React.memo(({
                                       to_principal,
                                       boxItem,
                                       setOpen,
                                       info
                                     }: { to_principal: Principal, boxItem?: BoxAllInfo, setOpen: Function, info?: Profile__1 }) => {
  const {principal} = useAuth()
  const {t} = useTranslation()

  const goto = useCallback(() => {
    const to = String(to_principal)
    window.open(`/${to}`)
  }, [to_principal])

  const handleCancel = useCallback((e) => {
    e.stopPropagation()
    boxItem && toast_api(unShare, boxItem.box_name, "unshared").then(() => MBApi.getBoxes(principal))
    setOpen(false)
  }, [boxItem, principal])

  const unShare = () => {
    return new Promise(async (resolve, reject) => {
      if (boxItem && to_principal) {
        const databoxApi = DataBoxApi(boxItem.canister_id.toString())
        const unShareRes = await Promise.all([MBApi.removeShareBox(boxItem.canister_id, to_principal), databoxApi.deleteCon(to_principal)])
        if (Object.keys(unShareRes[0])[0] === "ok") {
          if (Object.keys(unShareRes[1])[0] === "ok") {
            const email: UnhandledEmail = {
              from: String(principal),
              headline: `${t("Notify.cancel_box")}--${boxItem.box_name}`,
              description: boxItem.box_name,
              share_type: "cancel_box",
              share_value: boxItem.canister_id.toString()
            }
            const res_2 = await RequestApi.sendEmail(to_principal, email) as any
            if (res_2.ok) resolve("ok")
          }
          //@ts-ignore
          else reject(String(Object.keys(unShareRes[1].err)[0]))//@ts-ignore
        } else reject(String(Object.keys(unShareRes[0].err)[0]))
      }
    })
  }


  const props = useMemo(() => {
    return {goto, info, handleCancel, isOwner: true}
  }, [goto, info, handleCancel])

  return <OtherItemView {...props}/>
});
