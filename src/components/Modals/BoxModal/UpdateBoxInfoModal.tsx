import {useAuth} from '@/usehooks/useAuth';
import React, {memo, useCallback, useRef, useState} from 'react';
import "./index.css";
import {DataBoxApi, MBApi} from '@/api';
import {BoxAllInfo, BoxInfo__1} from "@/did/model/MBox";
import {toast_api} from "@/utils/T";
import {View} from "./View";
import {UploadFile, UploadProps} from "antd/es/upload/interface";

export const UpdateBoxInfoModal = memo(({
                                          open,
                                          setOpen,
                                          boxItem
                                        }: { open: boolean, setOpen: Function, boxItem?: BoxAllInfo }) => {
  const [name, setName] = useState("")
  const [isPrivate, setPrivate] = useState(true)
  const {principal} = useAuth()
  const inputRef1 = useRef(null)
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps['onChange'] = useCallback(({fileList: newFileList}) => {
    setFileList(newFileList);
  }, [])

  const clear = React.useCallback(() => {
    setName("")
    setPrivate(true)
    //@ts-ignore
    if (inputRef1.current) inputRef1.current.value = '';
    setOpen(false)
    setFileList([])
  }, [])

  const checkValue = () => {
    if (boxItem) {
      return name ? name : boxItem.box_name
    } else return ""
  }

  const handleClick = useCallback(() => {
    if (boxItem) {
      const arg: BoxInfo__1 = boxItem
      const edit = () => {
        return new Promise(async (resolve, reject) => {
          try {
            const databoxApi = DataBoxApi(boxItem.canister_id.toString())
            if (fileList.length > 0) databoxApi.upload_avatar(fileList[0]).then()
            return resolve(await MBApi.updateBoxInfo({
              ...arg,
              box_name: newName,
              is_private: isPrivate
            }))
          } catch (e) {
            reject(e)
          }
        })
      }
      const newName = checkValue()
      toast_api(edit, boxItem.box_name, "edit").then(() => MBApi.getBoxes(principal))
    }
    clear()
  }, [boxItem, name, isPrivate, principal, fileList])

  const props = React.useMemo(() => {
    return {title: "title_2", handleClick, clear, open, setName, inputRef1, isPrivate, setPrivate, fileList, onChange}
  }, [handleClick, clear, open, setName, inputRef1, isPrivate, setPrivate, fileList, onChange])

  return (
    <View {...props}/>
  );
});
