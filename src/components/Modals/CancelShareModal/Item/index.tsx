import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {DataBoxApi, RequestApi, UnhandledEmail} from "@/api";
import {AssetExt} from "@/did/model/DataBox";
import {Profile__1} from "@/did/model/Profile";
import {toast_api} from "@/utils/T";
import {OtherItemView} from "@/components/Modals/components";
import {Principal} from "@dfinity/principal";
import {useAuth} from "@/usehooks/useAuth";
import {useTranslation} from "react-i18next";

export const ShareItem = React.memo(({
                                       fileExt,
                                       setOpen,
                                       info, v
                                     }: { fileExt: AssetExt, setOpen: Function, info?: Profile__1, v: Principal }) => {
  const {canister_id}: { canister_id: string } = useParams()
  const {principal} = useAuth()
  const {t} = useTranslation()
  const dataBoxApi = React.useMemo(() => {
    return DataBoxApi(canister_id)
  }, [canister_id])

  const goto = useCallback(() => {
    const to = String(v)
    window.open(`/${to}`)
  }, [v])

  const cancel = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const isEncrypt = !!fileExt.aes_pub_key[0]
        const res = isEncrypt ? await dataBoxApi.deleteShareFile(fileExt.file_key, v)
          : await dataBoxApi.removePrivatePlainShare(fileExt.file_key, v)
        if (res) {
          const email: UnhandledEmail = {
            from: String(principal),
            headline: `${t("Notify.cancel_file")}--${fileExt.file_name}`,
            description: "",
            share_type: "cancel_file",
            share_value: fileExt.file_key
          }
          const res_2 = await RequestApi.sendEmail(v, email) as any
          if (res_2.ok) resolve("ok")
          else reject("server error")
        } else return reject("error")
      } catch (e) {
        reject(e)
      }
    })
  }

  const handleCancel = React.useCallback((e) => {
    e.stopPropagation()
    toast_api(cancel, fileExt.file_name, "unshare").then(() => dataBoxApi.refresh())
    setOpen(false)
  }, [fileExt, setOpen, v, principal])


  const props = useMemo(() => {
    return {goto, info, handleCancel, isOwner: true}
  }, [goto, info, handleCancel])

  return <OtherItemView {...props}/>
})
