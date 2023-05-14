import {useAuth} from '@/usehooks/useAuth';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import "./index.css";
import {DataBoxApi, LedgerApi, MBApi} from '@/api';
import {toast_api} from "@/utils/T";
import {View} from "./View";
import {UploadFile, UploadProps} from "antd/es/upload/interface";
import {updateBoxes, useBalanceStore, useBoxesStore} from "@/redux";

export const CreateBoxModal = memo(({
                                      open,
                                      setOpen, is_need_refresh, needICP
                                    }: { open: boolean, setOpen: Function, is_need_refresh: boolean, needICP: number }) => {
  const [name, setName] = useState("")
  const [isPrivate, setPrivate] = useState(true)
  const {principal} = useAuth()
  const balance = useBalanceStore()
  const inputRef1 = useRef(null)
  const {isFirstDataBox} = useBoxesStore()
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    LedgerApi.account_balance().then()
  }, [open])

  const check_balance = () => balance >= needICP


  const onChange: UploadProps['onChange'] = React.useCallback(({fileList: newFileList}) => {
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

  const handleClick = useCallback(() => {
    const create = () => {
      return new Promise(async (resolve, reject) => {
        // const is_enough = check_balance()
        // if (!is_enough) return reject("insufficient balance")
        try {
          const arg = {
            'is_private': isPrivate,
            'box_name': name,
            'box_type': {data_box: null},
          }
          const res = isFirstDataBox ? await MBApi.createBoxFee(arg, is_need_refresh) : await MBApi.createBox(arg)
          const databoxApi = DataBoxApi(res)
          if (fileList.length > 0) await databoxApi.upload_avatar(fileList[0])
          return resolve("ok")
        } catch (e) {
          reject(e)
        }
      })
    }

    toast_api(create, name, "create").then(() => {
      MBApi.getBoxes(principal).then()
      updateBoxes({isFirstDataBox: true}).then()
      LedgerApi.account_balance().then()
    })
    clear()
  }, [isPrivate, name, principal, fileList, is_need_refresh, isFirstDataBox, balance, needICP])

  const props = React.useMemo(() => {
    return {title: "title_1", handleClick, clear, open, setName, inputRef1, isPrivate, setPrivate, fileList, onChange}
  }, [handleClick, clear, open, setName, inputRef1, isPrivate, setPrivate, fileList, onChange])

  return (
    <View {...props}/>
  );
});
