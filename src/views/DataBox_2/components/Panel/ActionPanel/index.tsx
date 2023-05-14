import React, {useState} from 'react';
import {ActionPanelStyles as Styled} from "./styles";
import {useKeyStore, useOwnerStore} from "@/redux";
import {DataBoxApi, MBApi, RequestApi} from "@/api";
import {useParams} from "react-router-dom";
import {NormalDialogModal, ShareFileModal} from "@/components";
import {AssetExt, FileExt} from "@/did/model/DataBox";
import {DetailDrawer} from "@/views/DataBox_2/components";
import {handleDownloadApi, toast_api} from "@/utils/T";
import {Items} from "@/views/DataBox_2/components/Panel/Items";
import {useAuth} from '@/usehooks/useAuth';
import {delete_recent_download} from "@/utils/common";
import {useTranslation} from "react-i18next";
import {MintApi} from '@/api/Mint';


export const ActionPanel = React.memo(({
                                         top,
                                         left,
                                         isShow,
                                         fileExt,
                                         setShow, isPoor, ref_1, nfts
                                       }: { top: number, left: number, isShow: boolean, fileExt?: AssetExt, setShow: Function, isPoor: boolean, ref_1: React.MutableRefObject<HTMLDivElement | null>, nfts: FileExt[] }) => {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const {canister_id}: { canister_id: string } = useParams()
  const [openShare, setOpenShare] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openUrl, setOpenUrl] = useState(false)
  const {principal} = useAuth()
  const {privateKey} = useKeyStore()
  const {isOwner} = useOwnerStore()
  const {t} = useTranslation()
  const [openMint, setOpenMint] = useState(false)

  const isPlainAndPublicFile = React.useMemo(() => {
    if (fileExt) {
      if (fileExt.aes_pub_key[0]) {//密文
        return false
      }
      return !fileExt.is_private;

    }
    return false
  }, [fileExt])

  const dataBoxApi = React.useMemo(() => {
    return DataBoxApi(canister_id)
  }, [canister_id])

  const isNft = React.useMemo(() => {
    if (!fileExt) return false
    const a = nfts.find(e => {
      if ("PlainFileExt" in e) {
        return e.PlainFileExt.file_key === fileExt.file_key
      }
      return false
    })
    return !!a;
  }, [fileExt, nfts])

  const ItemArr = isOwner ? !isNft ? ["action_download", "action_detail", "action_share", "action_delete", "mint"] : ["action_download", "action_detail", "action_share", "action_delete"] : ["action_download", "action_detail"]

  const handleDownload = async () => {
    handleDownloadApi(dataBoxApi, privateKey, fileExt).then()
  }

  const handleShare = () => fileExt?.is_private ? setOpenShare(true) : setOpenUrl(true)

  const handleDelete = React.useCallback(async () => {
    if (fileExt) {
      const isEncrypt = !!fileExt.aes_pub_key[0]
      toast_api(dataBoxApi.deletekey2(isEncrypt, [fileExt.file_key]), fileExt.file_name, "delete").then(() => {
        dataBoxApi.refresh_three_time()
        principal && delete_recent_download(fileExt, principal)
      })
      setOpenConfirmDelete(false)
    }
  }, [fileExt, dataBoxApi, principal])

  const Mint = async () => {
    if (fileExt) {
      const boxApi = DataBoxApi(fileExt.bucket_id.toString())
      const _mint = () => {
        return new Promise(async (resolve, reject) => {
          try {
            // const log_res = await boxApi.mintNftFile(fileExt.file_key)
            // if (log_res) return resolve("ok")
            // return reject("log error")
            const mint_res = await MintApi.mintToken(fileExt, "")
            if (mint_res) {
              const log_res = await boxApi.mintNftFile(fileExt.file_key)
              if (log_res) return resolve("ok")
              return reject("log error")
            } else return reject("mint error")
          } catch (e) {
            reject(e)
          }
        })
      }
      toast_api(_mint(), fileExt.file_name, "mint").then(e => {
        boxApi.refresh()
      })
    }
  }

  const handleClick = React.useCallback((index) => {
    return () => {
      setShow(false)
      switch (index) {
        case 0:
          handleDownload()
          break;
        case 1:
          setOpenDrawer(true)
          break;
        case 2:
          handleShare()
          break;
        case 3:
          setOpenConfirmDelete(true)
          break;
        case 4://mint
          setOpenMint(true)
          break;
        default:
          return 0
      }
    }
  }, [privateKey, fileExt])

  return <Styled.MainContainer isShow={isShow} ref={ref_1}
                               style={{top: `${top}px`, left: `${left}px`,}}>
    <DetailDrawer fileExt={fileExt} setOpen={setOpenDrawer} open={openDrawer}/>
    <ShareFileModal open={openShare} setOpen={setOpenShare} fileExt={fileExt}/>
    <NormalDialogModal onOK={Mint} setOpen={setOpenMint} open={openMint}
                       title={`Mint NFT`}
                       description={`Are you sure to mint this file into nft?`}
                       isLink={false}/>
    <NormalDialogModal onOK={handleDelete} isLink={false} description={t("DeleteFile.title")}
                       title={t("DeleteFile.content")}
                       open={openConfirmDelete}
                       setOpen={setOpenConfirmDelete}/>
    <NormalDialogModal open={openUrl} setOpen={setOpenUrl} title={"File Link"} isLink={true}
                       description={`https://${fileExt?.bucket_id.toString()}.raw.ic0.app/file/${fileExt?.file_key}`}/>
    <Items isPoor={isPoor} ItemArr={ItemArr} handleClick={handleClick}/>
  </Styled.MainContainer>
})


