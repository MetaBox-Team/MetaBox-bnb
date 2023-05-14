import React from 'react';
import {AssetExt} from "@/did/model/DataBox";
import {Foot} from "@/views/DataBox_2/components/Foot";
import {toast_api} from "@/utils/T";
import {delete_recent_download, get_all_keys} from "@/utils/common";
import {useParams} from "react-router-dom";
import {DataBoxApi, RequestApi} from "@/api";
import {useKeyStore} from "@/redux";
import {useAuth} from '@/usehooks/useAuth';
import {Principal} from "@dfinity/principal";

interface Props {
  isMutiSelect: boolean,
  fileArr: AssetExt[],
  clean: Function,
  isMyShared: boolean,
  isPoor: boolean
}

export const AllFileFoot = React.memo((props: Props) => {
  const {fileArr, clean, isMyShared} = props
  const {canister_id}: { canister_id: string } = useParams()
  const {principal} = useAuth()
  const dataBoxApi = React.useMemo(() => {
    return DataBoxApi(canister_id)
  }, [canister_id])
  const {privateKey} = useKeyStore()

  const download_file = React.useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        const all_promise: Promise<Blob>[] = []
        const {plain_key_arr, encrypt_key_arr, ipfs_arr} = get_all_keys(fileArr)
        plain_key_arr.forEach(e => all_promise.push(dataBoxApi.getPlain2(e)))
        encrypt_key_arr.forEach(e => all_promise.push(dataBoxApi.getEncrypt2(e, privateKey)))
        const res = await Promise.all(all_promise)
        res.forEach(e => window.open(URL.createObjectURL(e)))
        ipfs_arr.forEach(e => window.open(e))
        resolve("")
      } catch (e) {
        reject(e)
      }
    })
  }, [fileArr, privateKey])

  const handleDownload = React.useCallback(async () => {
    clean()
    await toast_api(download_file, "multiple files", "download")
  }, [clean, download_file])

  const handleDelete = React.useCallback(async () => {
    clean()
    const {plain_key_arr, encrypt_key_arr, ipfs_key_arr} = get_all_keys(fileArr)
    const delete_file = () => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await Promise.all([dataBoxApi.deletekey2(true, encrypt_key_arr), dataBoxApi.deletekey2(false, plain_key_arr), dataBoxApi.deletekey2(false, ipfs_key_arr)])
          if (res[0] && res[1] && res[2]) resolve("")
          else reject("")
        } catch (e) {
          reject(e)
        }
      })
    }
    toast_api(delete_file, `${plain_key_arr.length}plaintexts ${encrypt_key_arr.length}ciphertexts`, "delete").then(e => {
      dataBoxApi.refresh_three_time()
      principal && delete_file_recent(fileArr, principal)
    })
  }, [fileArr, dataBoxApi, principal])

  const delete_file_recent = (fileArr: AssetExt[], principal: Principal) => {
    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i]
      delete_recent_download(file, principal)
    }
  }

  return <Foot {...props} handleDownload={handleDownload}
               handleDelete={isMyShared ? undefined : handleDelete}/>
})

