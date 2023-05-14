import type {UploadFile, UploadProps} from 'antd/es/upload/interface';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import "./index.css";
import {useBoxesStore, useProfileStore} from '@/redux';
import {ProfileApi} from '@/api';
import {toast_api} from "@/utils/T";
import {View} from "./View";

export const CreateLinkModal = React.memo(({
                                             open,
                                             setOpen,
                                           }: { open: boolean, setOpen: Function }) => {
  const inputRef1 = useRef(null)
  const inputRef2 = useRef(null)
  const {profile} = useBoxesStore()
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [linkInfo, setLinkInfo] = useState({
    url: "",
    name: ''
  })


  const handleInput = (key: string, value: string) => {
    const newInfo = {...linkInfo, [key]: value}
    setLinkInfo(newInfo)
  }

  const onChange: UploadProps['onChange'] = React.useCallback(({fileList: newFileList}) => {
    setFileList(newFileList);
  }, [])

  const clean = () => {
    //@ts-ignore
    if (inputRef1.current) inputRef1.current.value = '';
    //@ts-ignore
    if (inputRef2.current) inputRef2.current.value = '';
    setFileList([])
  }

  const handleCancel = React.useCallback(() => {
    clean()
    setLinkInfo({
      url: "",
      name: ''
    })
    setOpen(false)
  }, [])


  const create_link = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (profile) {
          const profileApi = ProfileApi(profile)
          let image_url = ''
          if (fileList.length > 0) {
            const file_key = await profileApi.putLinkImage(fileList[0])
            if (file_key) {
              image_url = `https://${profile}.raw.ic0.app/link/${file_key}`
            } else return reject("key error")
          }
          const url = linkInfo.url.includes("http") ? linkInfo.url : `https://${linkInfo.url}`
          const res = await profileApi.addLink({
            url,
            'image_url': image_url ? [image_url] : [],
            'name': linkInfo.name,
          })
          if (Object.keys(res)[0] === "ok") return resolve("")//@ts-ignore
          else return reject(String(Object.keys(res.err)[0]))
        } else return reject("state error")
      } catch (e) {
        reject(e)
      }
    })
  }

  const handleConfirm = useCallback(async () => {
    if (profile) {
      const profileApi = ProfileApi(profile)
      toast_api(create_link, linkInfo.name, "create").then((e) => {
        profileApi.getLinks().then()
      })
    }
    handleCancel()
  }, [profile, linkInfo, fileList])

  const props = useMemo(() => {
    return {
      handleConfirm,
      handleCancel,
      open,
      isCreateLink: true,
      fileList,
      onChange,
      inputRef1,
      inputRef2,
      old_description: undefined,
      old_name: undefined,
      handleInput
    }
  }, [
    handleConfirm,
    handleCancel,
    open,
    fileList,
    onChange,
    inputRef1,
    inputRef2,
    handleInput])

  return (
    <View {...props}/>
  );
})

