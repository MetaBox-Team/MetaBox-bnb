import React, {useState} from 'react';
import {FootStyles as Styled} from "./styles";
import {Gap, NewButton, NormalDialogModal} from "@/components";
import Icon from "@/icons/Icon";
import {useOwnerStore} from "@/redux";
import Tooltip from 'antd/es/tooltip';
import {useTranslation} from "react-i18next";

export const Foot = React.memo((props: { isPoor: boolean, isMutiSelect: boolean, clean: any, handleDelete?: Function, handleDownload: React.MouseEventHandler<HTMLDivElement> }) => {
  const {
    isMutiSelect,
    clean,
    handleDelete
  } = props
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const {isOwner} = useOwnerStore()
  const {t} = useTranslation()

  const delete_all = React.useCallback(() => setOpenConfirmDelete(true), [])

  return (
    <Styled.Foot isMutiSelect={isOwner ? isMutiSelect : false}>
      <NormalDialogModal onOK={handleDelete} isLink={false} description={t("DeleteFile.title")}
                         title={t("DeleteFile.content")}
                         open={openConfirmDelete}
                         setOpen={setOpenConfirmDelete}/>
      <Left delete_all={delete_all} {...props}/>
      <Close clean={clean}/>
    </Styled.Foot>
  );
})

const Left = React.memo((props: { isPoor: boolean, handleDelete?: Function, handleDownload: React.MouseEventHandler<HTMLDivElement>, delete_all: React.MouseEventHandler<HTMLDivElement> }) => {
  return <Styled.FootLeft>
    <DeleteButton  {...props}/>
    <Gap width={39}/>
    <DownloadButton {...props}/>
  </Styled.FootLeft>
})

const DownloadButton = React.memo(({handleDownload}: { handleDownload: React.MouseEventHandler<HTMLDivElement> }) => {
  return <NewButton padding={"1.2rem 3.2rem"} onClick={handleDownload}
                    content={<div style={{display: "flex", alignItems: "center"}}><Icon color={"white"}
                                                                                        name={"download"}/>&nbsp;Download
                    </div>}/>
})

const DeleteButton = React.memo(({
                                   handleDelete,
                                   delete_all, isPoor
                                 }: { isPoor: boolean, handleDelete?: Function, delete_all: React.MouseEventHandler<HTMLDivElement> }) => {

  const handleClick = (e) => !isPoor && delete_all(e)

  return <Tooltip title={isPoor ? "Insufficient cycles" : ""}>
    <NewButton
      style={{display: handleDelete ? "flex" : "none", cursor: isPoor ? "no-drop" : "pointer"}}
      padding={"1.2rem 3.2rem"}
      onClick={handleClick}
      content={
        <div style={{display: "flex", alignItems: "center"}}>
          <Icon color={"white"}
                name={"delete_link"}/>&nbsp;Delete
        </div>}/>
  </Tooltip>
})

const Close = React.memo(({clean}: { clean: React.MouseEventHandler<HTMLDivElement> }) => {
  return <div style={{cursor: "pointer"}} onClick={clean}><Icon name={'close'}/></div>
})

