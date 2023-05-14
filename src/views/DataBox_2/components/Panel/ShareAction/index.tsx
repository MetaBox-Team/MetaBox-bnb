import React, {useState} from 'react';
import {ActionPanelStyles as Styled} from "./styles";
import {useKeyStore, sharedType} from "@/redux";
import {DataBoxApi} from "@/api";
import {useParams} from "react-router-dom";
import {AssetExt} from "@/did/model/DataBox";
import {DetailDrawer} from "@/views/DataBox_2/components";
import {CancelShareModal} from "@/components/Modals/CancelShareModal";
import {handleDownloadApi, handleDownloadSharedFile, toast_api} from "@/utils/T";
import {Items} from "@/views/DataBox_2/components/Panel/Items";
import {delete_recent_download} from "@/utils/common";
import {useAuth} from '@/usehooks/useAuth';

export const ShareActionPanel = React.memo((props: { isPoor: boolean; top: number, left: number, isShow: boolean, sharedFile?: sharedType, fileExt?: AssetExt, setShow: Function, ref_2: React.MutableRefObject<HTMLDivElement | null> }) => {
  const {
    top,
    left,
    isShow,
    sharedFile,
    fileExt,
    setShow, isPoor, ref_2
  } = props
  const {canister_id}: { canister_id: string } = useParams()
  const {principal} = useAuth()
  const {privateKey} = useKeyStore()
  const [openMyShareDrawer, setOpenMyShareDrawer] = useState(false)
  const [openCancelShareModal, setOpenCancelShareModal] = useState(false)
  const [openSharedMeDrawer, setOpenSharedMeDrawer] = useState(false)
  const dataBoxApi = React.useMemo(() => {
    return DataBoxApi(canister_id)
  }, [canister_id])
  const ItemArr = ["action_download", "action_detail", "action_delete"]

  const handleDownload = async () => {
    if (fileExt) {
      handleDownloadApi(dataBoxApi, privateKey, fileExt).then()
    } else if (sharedFile) {
      handleDownloadSharedFile(sharedFile, privateKey).then()
    }
  }

  const handleDelete = async () => {
    if (fileExt) {
      setOpenCancelShareModal(true)
    } else if (sharedFile) {
      await toast_api(dataBoxApi.deleteSharedFile([sharedFile.file_key]), sharedFile.file_name, "unshared")
      dataBoxApi.refresh_three_time()
      principal && delete_recent_download(sharedFile, principal)
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
          fileExt ? setOpenMyShareDrawer(true) : setOpenSharedMeDrawer(true)
          break;
        case 2:
          handleDelete()
          break;
        default:
          return 0
      }
    }
  }, [fileExt, privateKey, sharedFile])

  const drawer_props = React.useMemo(() => {
    if (fileExt) return {fileExt}
    else if (sharedFile) return {sharedFile}
    else return {}
  }, [fileExt, sharedFile])

  return <Styled.MainContainer isShow={isShow} ref={ref_2}
                               style={{top: `${top}px`, left: `${left}px`,}}>
    <DetailDrawer {...drawer_props} setOpen={setOpenMyShareDrawer} open={openMyShareDrawer}/>
    <DetailDrawer {...drawer_props} setOpen={setOpenSharedMeDrawer} open={openSharedMeDrawer}/>
    <CancelShareModal fileExt={fileExt} setOpen={setOpenCancelShareModal} open={openCancelShareModal}/>
    <Items isPoor={isPoor} ItemArr={ItemArr} handleClick={handleClick}/>
  </Styled.MainContainer>
})


