import React, {useState} from 'react';
import {Scrollbar} from "@/styles";
import {ManageStyles as Styled} from "@/views/DataPanel/Manage/styles";
import Icon, {Name} from "@/icons/Icon";
import {go_to_error, go_to_success, handleDownloadApi, handleDownloadSharedFile, ICON, toast_api} from "@/utils/T";
import {desensitizationPrincipal} from "@/utils/formate";
import {useEmailStore, useKeyStore, useOwnerStore} from "@/redux";
import {DataBoxApi, RecentDownloadFile, RequestApi} from "@/api";
import {FileExt} from "@/did/model/DataBox";
import {toast} from "react-toastify";
import {useAuth} from '@/usehooks/useAuth';
import {Principal} from "@dfinity/principal";
import {useTranslation} from "react-i18next";

export const RecentDownload = React.memo(() => {
  const {recently_download} = useEmailStore()
  const {isOwner} = useOwnerStore()
  return (
    <Styled.MostDownload style={{display: isOwner ? "flex" : "none"}}>
      {!!recently_download &&
      recently_download.length > 0 ?
        <Scrollbar>
          {recently_download.map((v, k) => {
            return <Items key={k} v={v}/>
          })}
        </Scrollbar>
        :
        <Styled.NonMostDownloadItemWrap>
          <Styled.NonMostDownloadItem/>
        </Styled.NonMostDownloadItemWrap>
      }
    </Styled.MostDownload>
  )
})

const Items = React.memo(({v}: { v: RecentDownloadFile }) => {
  const {privateKey} = useKeyStore()
  const {principal} = useAuth()
  const [hoverOne, setHoverOne] = useState(-1)
  const {t} = useTranslation()

  const download_file = async () => {
    const toastId = toast.loading(t("SearchFile"))
    try {
      const dataBoxAPi = DataBoxApi(v.box_id)
      const file_ext = await dataBoxAPi.getAssetextkey(v.file_key) as FileExt as any
      go_to_success(toastId, t("FileExist"))
      setTimeout(() => {
        toast.dismiss(toastId)
      }, 1000)
      if (file_ext.SharedFileExt) {
        const assetExt = file_ext.SharedFileExt
        handleDownloadSharedFile(assetExt, privateKey).then()
      } else {
        const assetExt = file_ext.PlainFileExt ?? file_ext.EncryptFileExt
        handleDownloadApi(dataBoxAPi, privateKey, assetExt).then()
      }
    } catch (e) {
      if (e === "not found") {
        go_to_error(toastId, t("FileNotExist"))
        setTimeout(() => {
          toast.dismiss(toastId)
        }, 2000)
      }
    }
  }

  const delete_recent_download = () => {
    principal && RequestApi.delete_recent_download(
      {
        who: principal,
        ...v,
        box_id: Principal.from(v.box_id)
      }
    ).then(() => RequestApi.get_recent_download(principal))
  }

  return <Styled.MostDownloadItem>
    <Styled.MostDownloadItemLeft>
      <Icon name={ICON(v.file_type) as Name}/>
      &nbsp;
      {v.file_name.length > 30 ? desensitizationPrincipal(v.file_name, 10) : v.file_name}
    </Styled.MostDownloadItemLeft>
    <Styled.MostDownloadItemRight onMouseEnter={() => setHoverOne(0)} onMouseLeave={() => setHoverOne(-1)}
                                  onClick={delete_recent_download}>
      <Icon name="delete_link" color={hoverOne === 0 ? "rgba(185,179,238)" : "#4E4597"}/>
    </Styled.MostDownloadItemRight>
    <Styled.MostDownloadItemRight onMouseEnter={() => setHoverOne(1)} onMouseLeave={() => setHoverOne(-1)}
                                  onClick={download_file}>
      <Icon name="download" color={hoverOne === 1 ? "rgba(185,179,238)" : "#4E4597"}/>
    </Styled.MostDownloadItemRight>
  </Styled.MostDownloadItem>
})
