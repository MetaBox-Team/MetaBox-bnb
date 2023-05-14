import React, {useCallback, useEffect, useMemo, useState} from "react";
import {DataBoxStyles as Styled} from "./styles"
import {DataBoxInfo, NewButton, UploadModal} from "@/components";
import Icon from "@/icons/Icon";
import "./index.css"
import {TableMaintain} from "./components";
import {Header} from "@/components/Header";
import {useHistory, useParams} from "react-router-dom";
import {DataBoxApi} from "@/api";
import {clean, useAllFileStore, useBoxesStore, useOwnerStore} from "@/redux";
import {useTranslation} from "react-i18next";
import {TableHead} from "@/views/DataBox_2/components/TableHead";
import {toast} from "react-toastify";
import {useAuth} from "@/usehooks/useAuth";
import {AssetExt} from "@/did/model/DataBox";
import {exportToCSV} from "@/utils/common";

interface tableData {
  file_type: string
  file_name: string
  file_key: string
  file_extension: string
  total_size: number
  is_private: boolean,
  bucket_id: string,
  owner: string,
}


const Middle = React.memo(({setOpenUpload}: { setOpenUpload: Function }) => {
  const {box_avatars, boxes} = useBoxesStore()
  const {id}: { id: string } = useParams()
  const {principal} = useAuth()

  const is_need_icon = React.useMemo(() => {
    if (principal && boxes) return String(principal) === String(boxes[Number(id)].owner)
    return false
  }, [principal, boxes, id])

  return <Styled.MiddleWrap>
    <DataBoxInfo boxItem={boxes && boxes[id]} url={box_avatars && box_avatars[id]} is_need_icon={is_need_icon}
                 box_name={boxes && boxes[id].box_name}
                 width={"12.4rem"} height={"12.4rem"}/>
    <MiddleRight setOpenUpload={setOpenUpload}/>
  </Styled.MiddleWrap>
})

const MiddleRight = React.memo(({setOpenUpload}: { setOpenUpload: Function }) => {
  const {isOwner} = useOwnerStore()
  const {t} = useTranslation()
  const all_box_files = useAllFileStore()
  const {canister_id}: { canister_id: string } = useParams()
  const Translate = (anchor: string) => t(`DataBox.${anchor}`)
  const handleClick = React.useCallback(() => setOpenUpload(true), [])

  const {encryptFiles, plainFiles, sharedWithMe} = useMemo(() => {
    const cid = canister_id
    const box_item = all_box_files.find(e => e.canisterID === cid)
    if (box_item) return {...box_item}
    else return {encryptFiles: [], plainFiles: [], sharedWithMe: []}
  }, [all_box_files, canister_id])

  const transform = (e: AssetExt) => {
    return {
      file_name: e.file_name,
      file_key: e.file_key,
      file_extension: e.file_extension,
      total_size: Number(e.total_size),
      bucket_id: String(e.bucket_id),
      is_private: e.is_private,
      owner: String(e.owner)
    }
  }

  const handleExport = () => {
    const tableTitle = ["fileType", "fileName", "fileKey", "fileExtension", "fileSize", "dataBoxID", "isPrivate", "owner"]
    const encryptData: tableData[] = []
    const plainData: tableData[] = []
    const sharedData: tableData[] = []
    encryptFiles?.forEach(e => {
      encryptData.push({
        file_type: "encryptedText",
        ...transform(e)
      })
    })
    plainFiles?.forEach(e => {
      plainData.push({
        file_type: "plainText",
        ...transform(e)
      })
    })
    sharedWithMe?.forEach(e => {
      sharedData.push({
        file_type: "sharedFile",
        file_name: e.file_name,
        file_key: e.file_key,
        file_extension: e.file_extension,
        total_size: NaN,
        bucket_id: "null",
        is_private: !e.isPublic,
        owner: String(e.other)
      })
    })
    exportToCSV(tableTitle, [...encryptData, ...plainData, ...sharedData])
  }

  return <Styled.MiddleWrapRight>
    <NewButton style={{display: isOwner ? 'flex' : "none"}} padding={"1.2rem 3.2rem"} onClick={handleExport}
               content={
                 <div style={{display: "flex", alignItems: "center"}}>
                   <Icon color={"white"} name={"upload"}/>&nbsp;Export
                 </div>}/>
    <div style={{width: "1rem"}}/>
    <NewButton style={{display: isOwner ? 'flex' : "none"}} padding={"1.2rem 3.2rem"} onClick={handleClick}
               content={
                 <div style={{display: "flex", alignItems: "center"}}>
                   <Icon color={"white"} name={"upload"}/>&nbsp;{Translate("upload")}
                 </div>}/>
  </Styled.MiddleWrapRight>
})

const Table = React.memo(() => {
  const [clickOne, setClickOne] = useState(0)

  return <Styled.Table>
    <TableHead clickOne={clickOne} setClickOne={setClickOne}/>
    <TableMaintain dataType={clickOne}/>
  </Styled.Table>
})


export function DataBox() {
  const [openUpload, setOpenUpload] = useState(false)
  const {canister_id, user}: { canister_id: string, user: string } = useParams()
  const {boxes} = useBoxesStore()
  const {t} = useTranslation()
  const dataBoxApi = React.useMemo(() => DataBoxApi(canister_id), [canister_id])
  const history = useHistory()


  useEffect(() => {
    dataBoxApi.refresh()
  }, [])

  const check = () => {
    if (boxes) {
      const box = boxes.find(e => e.canister_id.toString() === canister_id)
      if (box && Object.keys(box.status)[0] === "stopped") {
        toast.error(t("toast.start_box"))
        setTimeout(() => {
          history.push(`/datapanel/${user}`)
        }, 2000)
      }
    }
  }

  const clean_1 = useCallback(() => {
    clean(canister_id)
  }, [canister_id])

  useEffect(() => {
    boxes && check()
  }, [boxes])

  return (
    <Styled.DataBoxWrap>
      <UploadModal open={openUpload} setOpen={setOpenUpload}/>
      <Header isNeedIcon={true} onClick={clean_1}/>
      <Middle setOpenUpload={setOpenUpload}/>
      <Table/>
    </Styled.DataBoxWrap>
  );
}

