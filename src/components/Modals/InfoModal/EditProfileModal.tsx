import type {UploadFile, UploadProps} from 'antd/es/upload/interface';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import "./index.css";
import {useBoxesStore, useProfileStore} from '@/redux';
import {ProfileApi} from '@/api';
import {SetProfileArgs} from "@/did/model/Profile";
import {normal_judge} from "@/utils/common";
import {toast_api} from "@/utils/T";
import {View} from "./View";

export const EditProfileModal = React.memo(({
                                              open,
                                              setOpen,
                                            }: { open: boolean, setOpen: Function }) => {
  const inputRef1 = useRef(null)
  const inputRef2 = useRef(null)
  const {profile} = useBoxesStore()
  const {name: old_name, description: old_description, avatar_url} = useProfileStore()
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    description: ""
  })

  const handleInput = (key: string, value: string) => {
    const newInfo = {...profileInfo, [key]: value}
    setProfileInfo(newInfo)
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
    setProfileInfo({
      name: "",
      description: ""
    })
    setOpen(false)
  }, [])

  const checkValue = () => {
    const {name, description} = profileInfo
    const new_name = !!name ? name : old_name
    const new_description = !!description ? description : old_description
    return {new_name, new_description}
  }

  const edit = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (profile) {
          const profileApi = ProfileApi(profile)
          const {new_name, new_description} = checkValue()
          const arg_0: SetProfileArgs = {
            name: new_name ? [new_name] : [],
            description: new_description ? [new_description] : [],
            avatar_url: avatar_url ? [avatar_url] : []
          }
          if (fileList.length === 0) {
            const res = await profileApi.setProfile(arg_0)//@ts-ignore
            if (res.ok) resolve("")
            else reject("")
          } else {
            const avatar = await profileApi.setAvatar(fileList[0])
            arg_0.avatar_url = [`https://${profile}.raw.ic0.app/profile/avatar/${avatar}`]
            const res = await profileApi.setProfile(arg_0)
            if (normal_judge(res)) {
              profileApi.updateProfileInfo().then()
              resolve("")
            } else reject("")
          }
        } else reject("")
      } catch (e) {
        reject(e)
      }
    })
  }


  const handleConfirm = useCallback(async () => {
    if (profile) {
      const profileApi = ProfileApi(profile)
      toast_api(edit, "message", "edit").then(e => {
        profileApi.updateProfileInfo().then()
      }).catch(e => {
        throw e
      })
    }
    handleCancel()
  }, [profile, profileInfo, old_name, old_description, avatar_url, fileList])

  const props = useMemo(() => {
    return {
      handleConfirm,
      handleCancel,
      open,
      isCreateLink: false,
      fileList,
      onChange,
      inputRef1,
      inputRef2,
      old_description,
      old_name,
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
    old_description,
    old_name,
    handleInput])

  return (
    <View {...props}/>
  );
})



