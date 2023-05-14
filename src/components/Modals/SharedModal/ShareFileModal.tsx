import React, {useEffect, useRef, useState} from 'react';
import "./index.css";
import {DataBoxApi, MBApi, ProfileApi, RequestApi, RSAEncryptApi, UnhandledEmail} from "@/api";
import {useAuth} from "@/usehooks/useAuth";
import {AssetExt, Result_1} from "@/did/model/DataBox";
import {useKeyStore} from "@/redux";
import {error_text, get_principal, normal_judge} from "@/utils/common";
import {Principal} from "@dfinity/principal";
import {toast_api} from "@/utils/T";
import {View} from "./View";
import {useTranslation} from "react-i18next";
import {CacheApi, PubKeyNotFound} from '@/api/cache';

export const ShareFileModal = React.memo(({
                                            open,
                                            setOpen,
                                            fileExt
                                          }: { open: boolean, setOpen: Function, fileExt?: AssetExt }) => {
  const [isError, setIsError] = useState(false)
  const inputRef1 = useRef(null)
  const inputRef2 = useRef(null)
  const {principal} = useAuth()
  const {t} = useTranslation()
  const {privateKey} = useKeyStore()
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

  const getPubKey = async (to: Principal) => {
    const to_profile = await MBApi.getProfile(to)
    if (!to_profile) throw new Error("对方没有注册metabox")
    const toProfileApi = ProfileApi(to_profile.toString())
    return await toProfileApi.getPublicKey()
  }

  const shareEncryptFile = async (to: Principal): Promise<Result_1> => {
    try {
      if (fileExt) {
        const databoxApi = DataBoxApi(fileExt.bucket_id.toString())
        let to_public_key: string
        try {
          to_public_key = await CacheApi.get_pubkey(to)
          if (to_public_key === PubKeyNotFound) to_public_key = await getPubKey(to)
        } catch (e) {
          to_public_key = await getPubKey(to)
        }
        if (to_public_key !== "PubKeyNotFound") {
          const from_private_key = await RSAEncryptApi.importPrivateKey(privateKey)
          const preFileAesKey = await RSAEncryptApi.decryptMessage(
            from_private_key,
            fileExt.aes_pub_key[0]
          )
          const to_encryptedAesKey = await RSAEncryptApi.encryptMessage(
            to_public_key,
            preFileAesKey
          )
          return await databoxApi.setShareFile(fileExt.file_key, to, to_encryptedAesKey)
        } else throw new Error("对方没有注册metabox")
      } else throw new Error("")
    } catch (e) {
      throw e
    }
  }

  const sharePlainTextFile = async (to: Principal): Promise<Result_1> => {
    try {
      if (fileExt) {
        const databoxApi = DataBoxApi(fileExt.bucket_id.toString())
        return await databoxApi.addPrivatePlainShare(fileExt.file_key, to)
      } else throw new Error("error")
    } catch (e) {
      throw  e
    }
  }
  const shareFile = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const to = await get_principal(shareInfo.user_id)
        if (fileExt) {
          const email: UnhandledEmail = {
            from: String(principal),
            headline: t("Notify.share_file"),
            description: shareInfo.description,
            share_type: "File",
            share_value: JSON.stringify({
              file_key: fileExt.file_key,
              box_id: fileExt.bucket_id.toString(),
              file_type: fileExt.aes_pub_key[0] ? "EncryptFileExt" : "PlainFileExt"
            })
          }
          let promise: Promise<Result_1>
          const isEncrypt = !!fileExt.aes_pub_key[0]
          if (isEncrypt) promise = shareEncryptFile(to)
          else promise = sharePlainTextFile(to)
          const res_1 = await promise as any
          if (normal_judge(res_1)) {
            const res_2 = await RequestApi.sendEmail(to, email)//@ts-ignore
            if (res_2.ok) resolve("ok")
            else {
              const dataBoxApi = DataBoxApi(fileExt.bucket_id.toString())
              isEncrypt ? await dataBoxApi.deleteShareFile(fileExt.file_key, to)
                : await dataBoxApi.removePrivatePlainShare(fileExt.file_key, to)
              return reject("failed")
            }
          } else return reject(error_text(res_1.err))
        } else return reject("error")
      } catch (e) {
        reject(e)
      }
    })
  }


  const handleConfirm = async () => {
    try {
      if (fileExt) {
        const databoxApi = DataBoxApi(fileExt.bucket_id.toString())
        toast_api(shareFile(), fileExt.file_name, "share").then(() => databoxApi.refresh())
      }
      setOpen(false)
    } catch (e) {
      setIsError(true)
    }
  }

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

