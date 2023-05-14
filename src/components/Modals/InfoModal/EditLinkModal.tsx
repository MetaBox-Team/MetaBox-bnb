import React, {useCallback, useMemo, useRef, useState} from 'react';
import "./index.css";
import {useBoxesStore} from "@/redux";
import {ProfileApi} from "@/api";
import {Link} from "@/did/model/Profile";
import {error_text, normal_judge} from "@/utils/common";
import {UploadFile, UploadProps} from "antd/es/upload/interface";
import {toast_api} from "@/utils/T";
import {View} from "./View";

export const EditLinkModal = React.memo(({
                                           open,
                                           setOpen,
                                           link
                                         }: { open: boolean, setOpen: Function, link: Link }) => {
  const inputRef1 = useRef(null)
  const inputRef2 = useRef(null)
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const {profile} = useBoxesStore()
  const [newInfo, setNewInfo] = useState({
    url: "",
    name: ""
  })

  const clean = () => {
    //@ts-ignore
    if (inputRef1.current) inputRef1.current.value = '';
    //@ts-ignore
    if (inputRef2.current) inputRef2.current.value = '';
    setFileList([])
  }


  const handleInput = (key: string, value: string) => {
    const newInfo1 = {...newInfo, [key]: value}
    setNewInfo(newInfo1)
  }

  const handleCancel = useCallback(() => {
    clean()
    setNewInfo({
      url: "",
      name: ""
    })
    setOpen(false)
  }, [])

  const checkValue = () => {
    const {name, url} = newInfo
    const new_name = !!name ? name : link.name
    const new_url = !!url ? url : link.url
    return {new_name, new_url}
  }

  const edit_link = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (profile) {
          const profileApi = ProfileApi(profile)
          const {new_name, new_url} = checkValue()
          let image_url = ''
          if (fileList.length > 0) {
            const file_key = await profileApi.putLinkImage(fileList[0])
            if (file_key) {
              image_url = `https://${profile}.raw.ic0.app/link/${file_key}`
            }
          }
          const url = new_url.includes('http') ? new_url : `https://${new_url}`
          const res = await profileApi.setLink({
            'new_url': url,
            'old_url': link.url,
            'name': [new_name],
            'image_url': image_url ? [image_url] : [],
          })
          if (normal_judge(res)) return resolve("ok")//@ts-ignore
          else return reject(error_text(res.err))
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  const handleConfirm = useCallback(async () => {
    toast_api(edit_link, `${link.name}`, "edit").then((e: any) => {
      if (profile) {
        const profileApi = ProfileApi(profile)
        profileApi.getLinks().then()
      }
    })
    handleCancel()
  }, [link, profile, newInfo, fileList])

  const onChange: UploadProps['onChange'] = React.useCallback(({fileList: newFileList}) => {
    setFileList(newFileList);
  }, [])

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
      old_description: link.url,
      old_name: link.name,
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
    handleInput, link])
  return (
    <View {...props}/>
  );
})

