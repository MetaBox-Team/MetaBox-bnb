import {toast_promise} from "@/utils/Toast";
import {ToastState} from "@/components";
import React, {ReactText} from "react";
import {DataBox, DataBoxApi, RequestApi} from "@/api";
import {AssetExt} from "@/did/model/DataBox";
import {CommonStore} from "@/store/common.store";
import {retry, sleep} from "@/utils/common";
import {toast} from "react-toastify";
import {sharedType} from "@/redux";
import axios from "axios";


export const upload_toast = (toastId: ReactText) => {
  return toast.update(toastId, {render: `🦄 uploading...`, progress: 0})
}

export const go_to_error = (toastId: React.ReactText, text: string) => {
  return toast.update(toastId, {
    render: text,
    type: "error",
    icon: "🤯",
    closeOnClick: true
  })
}

export const go_to_success = (toastId: React.ReactText, text: string) => {
  return toast.update(toastId, {
    render: text,
    type: "success",
    icon: "🤯",
    progress: 1
  })
}


export const toast_api = async (promise: Promise<any> | (() => Promise<any>), fileName: string, actionType: string, notDefault?: boolean) => {
  return await toast_promise(
    promise,
    {
      render: (error) => {
        return !notDefault ?
          <ToastState fileName={fileName} children={<div>&nbsp;{actionType}&nbsp;failed!</div>}/> :
          <div>{String(error.data)}</div>
      }
    },
    {
      render: <ToastState fileName={fileName} children={<div>&nbsp;{actionType}&nbsp;processing...</div>}/>
    },
    {
      render: <ToastState fileName={fileName} children={<div>&nbsp;{actionType}&nbsp;successfully!</div>}/>
    }
  )
}

const one_request = (canisterId: string, fileKey: string, index: number) => {
  return (): Promise<{ data: ArrayBuffer, index: number }> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`https://${canisterId}.raw.ic0.app/${fileKey}/${index}`, {responseType: "arraybuffer"})
        if (res.data) return resolve({data: res.data, index})
        else return reject("network error")
      } catch (e) {
        reject("network error")
      }
    })
  }
}

const http_get = (file_ext: AssetExt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cid = file_ext.bucket_id.toString()
      const file_key = file_ext.file_key
      const need_query_times = Number(file_ext.need_query_times)
      const extension = file_ext.file_extension
      const promise_arr: (() => Promise<{ data: ArrayBuffer, index: number }>)[] = []
      for (let i = 0; i < need_query_times; i++) {
        promise_arr.push(one_request(cid, file_key, i))
      }
      const all_array = await retry<ArrayBuffer>(promise_arr, 4)
      const all_array_buffer: ArrayBuffer[] = []
      all_array.forEach(e => all_array_buffer.push(e.data))
      const newBlob = new Blob(all_array_buffer, {type: extension})
      const pre = newBlob.type.split("/")[0]
      if (pre === "image") window.open(URL.createObjectURL(newBlob))
      else to_disk(newBlob, file_ext.file_name)
      resolve(true)
    } catch (e) {
      reject(e)
    }
  })
}

export const handleDownloadSharedFile = async (sharedFile: sharedType, privateKey: string) => {
  const who = CommonStore.common.principal
  if (Object.keys(sharedFile.page_field)[0] === "IPFS") {//@ts-ignore
    window.open(sharedFile.page_field.IPFS)
    return 0
  }
  const download = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const owner_dataBoxApi = DataBoxApi(sharedFile.other.toString())
        const file_ext = await owner_dataBoxApi.getAssetextkey(sharedFile.file_key) as any
        let blob: Blob
        let name: string = ""
        if (file_ext.PlainFileExt) {
          name = file_ext.PlainFileExt.file_name
          blob = await owner_dataBoxApi.getPlain2(file_ext.PlainFileExt.file_key)
        } else {
          name = file_ext.EncryptFileExt.file_name
          blob = await owner_dataBoxApi.getEncrypt2(file_ext.EncryptFileExt.file_key, privateKey)
        }
        resolve("ok")
        const pre = blob.type.split("/")[0]
        if (pre === "image") window.open(URL.createObjectURL(blob))
        else to_disk(blob, name)
      } catch (e) {
        reject(e)
      }
    })
  }
  await toast_api(download, sharedFile.file_name, "download")
  who && RequestApi.add_recent_download({
    who: who,
    box_id: sharedFile.other,
    file_key: sharedFile.file_key,
    file_name: sharedFile.file_name,
    file_type: sharedFile.file_extension,
  }).then(() => RequestApi.get_recent_download(who))
}

export const to_disk = (blob: Blob, fileName: string) => {
  if (blob.size > 0) {
    if ("download" in document.createElement("a")) {
      const elink = document.createElement("a");
      elink.download = fileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    } else {
      //@ts-ignore
      navigator.msSaveBlob(blob, fileName);
    }
  }
}

const normalHandle = (res: Blob, fileExt: AssetExt) => {
  const pre = res.type.split("/")[0]
  if (pre === "image") window.open(URL.createObjectURL(res))
  else to_disk(res, fileExt.file_name)
}

export const handleDownloadApi = async (dataBoxApi: DataBox, privateKey: string, fileExt?: AssetExt) => {
  const who = CommonStore.common.principal
  if (fileExt) {
    const isEncrypt = !!fileExt.aes_pub_key[0]
    if ("IPFS" in fileExt.page_field) {
      if (!fileExt.aes_pub_key[0]) window.open(fileExt.page_field.IPFS)
      else {
        const res: Blob = await toast_api(dataBoxApi.getEncryptedDataFromIPFS(fileExt, privateKey), fileExt.file_name, "download")
        normalHandle(res, fileExt)
      }
    } else if ("Arweave" in fileExt.page_field) {
      if (!fileExt.aes_pub_key[0]) window.open(fileExt.page_field.Arweave)
      else {
        const res: Blob = await toast_api(dataBoxApi.getEncryptedDataFromAR(fileExt, privateKey), fileExt.file_name, "download")
        normalHandle(res, fileExt)
      }
    } else {
      if (!fileExt.is_private) {
        await toast_api(http_get(fileExt), fileExt.file_name, "download")
      } else {
        const blob: Blob = await toast_api(isEncrypt ? dataBoxApi.getEncrypt2(fileExt.file_key, privateKey) : dataBoxApi.getPlain2(fileExt.file_key), fileExt.file_name, "download")
        normalHandle(blob, fileExt)
      }
    }
    who && RequestApi.add_recent_download({
      who,
      box_id: fileExt.bucket_id,
      file_key: fileExt.file_key,
      file_name: fileExt.file_name,
      file_type: fileExt.file_extension
    }).then(() => RequestApi.get_recent_download(who))
  }
}

export const ICON = (file_type: string) => {
  const pre = file_type.split("/")[0]
  const after = file_type.split("/")[1]
  if (pre === "image") return "file_image"
  else if (pre === "audio") return "file_audio"
  else if (pre === "video") return "file_video"
  else if (pre === "text") return "file_text"
  else if (pre === "application") {
    return switch_type(after)
  }
  return "file_other"
}

const switch_type = (file_type: string) => {
  switch (file_type) {
    case "pdf":
      return "file_pdf"
    case "zip":
      return "file_zip"
    case "vnd.openxmlformats-officedocument.presentationml.presentation":
      return "file_ppt"
    case "vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "file_word"
    case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "file_excel"
    default:
      return "file_other"
  }
}
