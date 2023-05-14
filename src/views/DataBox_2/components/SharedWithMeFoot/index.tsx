import React from 'react';
import {sharedType, useKeyStore} from "@/redux";
import {Foot} from "@/views/DataBox_2/components/Foot";
import {toast_api} from "@/utils/T";
import {DataBoxApi} from "@/api";
import {useParams} from "react-router-dom";
import {AssetExt} from "@/did/model/DataBox";
import {Principal} from "@dfinity/principal";
import {delete_recent_download} from "@/utils/common";
import {useAuth} from "@/usehooks/useAuth";

interface Props {
  isMutiSelect: boolean,
  sharedWithMeArr: sharedType[],
  clean: Function,
  isPoor: boolean
}

export const SharedWithMeFoot = React.memo(({isMutiSelect, sharedWithMeArr, clean, isPoor}: Props) => {
  const {privateKey} = useKeyStore()
  const {canister_id}: { canister_id: string } = useParams()
  const {principal} = useAuth()

  const dataBoxApi = React.useMemo(() => {
    return DataBoxApi(canister_id)
  }, [canister_id])
  const download_shared_file = React.useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        const all_promise: Promise<Blob>[] = []
        for (let i = 0; i < sharedWithMeArr.length; i++) {
          const sharedFile = sharedWithMeArr[i]
          if (Object.keys(sharedFile.page_field)[0] === "IPFS") {//@ts-ignore
            window.open(sharedFile.page_field.IPFS)
          } else {
            const owner_dataBoxApi = DataBoxApi(sharedFile.other.toString())
            const file_ext = await owner_dataBoxApi.getAssetextkey(sharedFile.file_key) as any
            if (file_ext.PlainFileExt) {
              all_promise.push(owner_dataBoxApi.getPlain2(file_ext.PlainFileExt.file_key))
            } else {
              all_promise.push(owner_dataBoxApi.getEncrypt2(file_ext.EncryptFileExt.file_key, privateKey))
            }
          }
        }
        const res = await Promise.all(all_promise)
        res.forEach(e => window.open(URL.createObjectURL(e)))
        resolve("")
      } catch (e) {
        reject(e)
      }
    })
  }, [sharedWithMeArr, privateKey])

  const get_all_keys = (): string[] => {
    let keys: string[] = []
    sharedWithMeArr.forEach(e => keys.push(e.file_key))
    return keys
  }

  const handleDelete = React.useCallback(() => {
    clean()
    const keys = get_all_keys()
    toast_api(dataBoxApi.deleteSharedFile(keys), `${sharedWithMeArr.length} shared files`, "delete").then(() => {
      dataBoxApi.refresh_three_time()
      principal && delete_file_recent(sharedWithMeArr, principal)
    })
  }, [sharedWithMeArr, principal, dataBoxApi])

  const delete_file_recent = (fileArr: sharedType[], principal: Principal) => {
    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i]
      delete_recent_download(file, principal)
    }
  }

  const handleDownload = React.useCallback(async () => {
    clean()
    await toast_api(download_shared_file, "multiple shared files", "download")
  }, [clean, download_shared_file])

  return <Foot isPoor={isPoor} clean={clean} isMutiSelect={isMutiSelect} handleDelete={handleDelete}
               handleDownload={handleDownload}/>
})

