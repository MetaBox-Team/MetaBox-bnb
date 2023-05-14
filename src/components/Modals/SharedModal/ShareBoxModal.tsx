import React, {useCallback, useEffect, useRef, useState} from 'react';
import "./index.css";
import {BoxAllInfo} from "@/did/model/MBox";
import {DataBoxApi, MBApi, ProfileApi, RequestApi, UnhandledEmail} from "@/api";
import {useAuth} from "@/usehooks/useAuth";
import {error_text, get_principal, normal_judge} from "@/utils/common";
import {Principal} from "@dfinity/principal";
import {toast_api} from "@/utils/T";
import {View} from "@/components/Modals/SharedModal/View";
import {useTranslation} from "react-i18next";

export const ShareBoxModal = React.memo(({
                                           open,
                                           setOpen,
                                           boxItem,
                                         }: { open: boolean, setOpen: Function, boxItem?: BoxAllInfo }) => {
  const [isError, setIsError] = useState(false)
  const inputRef1 = useRef(null)
  const inputRef2 = useRef(null)
  const {t} = useTranslation()
  const {principal} = useAuth()
  const [shareInfo, setShareInfo] = useState({
    user_id: "",
    description: ""
  });

  useEffect(() => {
    open && handleCancel()
  }, [open])

  const clean = () => {
    //@ts-ignore
    if (inputRef1.current) inputRef1.current.value = '';
    //@ts-ignore
    if (inputRef2.current) inputRef2.current.value = '';
    setIsError(false)
  }

  const handleInput = (key: string, value: string) => {
    const newOne = {...shareInfo, [key]: value}
    setShareInfo(newOne)
  }

  const share = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const to = await get_principal(shareInfo.user_id)
        if (boxItem) {
          const email: UnhandledEmail = {
            from: String(principal),
            headline: t("Notify.share_box"),
            description: shareInfo.description,
            share_type: "Box",
            share_value: boxItem.canister_id.toString(),
          }
          const databoxApi = DataBoxApi(boxItem.canister_id.toString())
          const res_1 = await MBApi.emitShareBox(boxItem.canister_id, to)
          if (normal_judge(res_1)) {
            const res_2 = await databoxApi.addCon(to)
            if (normal_judge(res_2)) {
              const res_3 = await RequestApi.sendEmail(to, email)//@ts-ignore
              if (res_3.ok) return resolve("ok")
              else return reject("failed")
            } else {
              MBApi.removeShareBox(boxItem.canister_id, to).then()
              //@ts-ignore
              reject(error_text(res_2.err))
            }//@ts-ignore
          } else reject(error_text(res_1.err))
        }
      } catch (e) {
        reject("")
        throw e
      }
    })
  }

  const handleConfirm = useCallback(async () => {
    try {
      boxItem && toast_api(share(), boxItem.box_name, "share").then(() => MBApi.getBoxes(principal))
      setOpen(false)
    } catch (e) {
      setIsError(true)
    }
  }, [shareInfo, boxItem, principal, t])

  const handleCancel = () => {
    clean()
    setShareInfo({
      user_id: "",
      description: ""
    })
  }

  const close = React.useCallback(() => setOpen(false), [])

  const props = React.useMemo(() => {
    return {open, handleConfirm, inputRef1, inputRef2, handleInput, isError, close}
  }, [open, handleConfirm, inputRef1, inputRef2, handleInput, isError, close])
  return (
    <View {...props}/>
  );
})

