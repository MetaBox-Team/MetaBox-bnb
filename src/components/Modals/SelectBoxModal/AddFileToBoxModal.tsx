import React, {useState} from 'react';
import "./index.css";
import {DataBoxApi, RequestApi, UnhandledEmail} from '@/api';
import {useAuth} from "@/usehooks/useAuth";
import {error_text, normal_judge} from "@/utils/common";
import {toast_api} from "@/utils/T";
import {View} from "@/components/Modals/SelectBoxModal/View";


export const AddFileToBoxModal = React.memo(({
                                               open,
                                               setOpen,
                                               email
                                             }: { open: boolean, setOpen: Function, email?: UnhandledEmail }) => {

  const {principal} = useAuth()
  const [whichBox, setWhichBox] = useState("")


  const put_shared_file = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (email) {
          const {file_key, box_id, file_type} = JSON.parse(email.share_value)
          const from_databoxApi = DataBoxApi(box_id)
          const to_databoxApi = DataBoxApi(whichBox)
          const fileExt = (await from_databoxApi.getAssetextkey(file_key))[file_type]
          const res = await to_databoxApi.put({
            'SharedFilePut': {
              'file_extension': fileExt.file_extension,
              'other': fileExt.bucket_id,
              'aes_pub_key': fileExt.aes_pub_key,
              'description': email.from,
              'file_name': fileExt.file_name,
              'file_key': fileExt.file_key,
              'isPublic': !fileExt.is_private,
              'page_field': fileExt.page_field,
            }
          })
          if (normal_judge(res)) {
            if (principal) {
              const res = await RequestApi.handleEmail(principal, {
                unhandled_email: email,
                operation: "Accept"
              })
              if (normal_judge(res)) resolve("ok")
              else reject("failed")
            } else reject("principal error") //@ts-ignore
          } else reject(error_text(res.err))
        } else reject("")
      } catch (e) {
        reject(e)
      }
    })
  }

  const handleConfirm = React.useCallback(() => {
    toast_api(put_shared_file, "file", "accept share").then(() => {
      const to_databoxApi = DataBoxApi(whichBox)
      to_databoxApi.refresh()
      principal && RequestApi.getUnHandle(principal)
    })
    setOpen(false)
    setWhichBox("")
  }, [whichBox, principal, email])

  const handleCancel = React.useCallback(() => {
    setWhichBox("")
    setOpen(false)
  }, [])

  const props = React.useMemo(() => {
    return {open, handleConfirm, handleCancel, whichBox, setWhichBox}
  }, [open, handleConfirm, handleCancel, whichBox, setWhichBox])

  return (
    <View {...props}/>
  );
})


