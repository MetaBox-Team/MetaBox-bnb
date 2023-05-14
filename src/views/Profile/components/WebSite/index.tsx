import React, {useState} from 'react';
import {WebSiteStyles as Styled} from "./styles";
import {WebSiteItem} from "../WebSiteItem"
import {CreateLinkModal, Gap, NewButton} from "@/components";
import {useLinksStore, useOwnerStore} from "@/redux";
import {useTranslation} from "react-i18next";
import {Link} from "@/did/model/Profile";

export const WebSite = React.memo(() => {
  const [openCreate, setOpenCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const links = useLinksStore()

  const handleCreate = React.useCallback(() => {
    setOpenCreate(true)
  }, [])

  const handleEdit = React.useCallback(() => {
    setShowEdit(!showEdit)
  }, [showEdit])


  return (
    <Styled.ContentWrapper>
      <CreateLinkModal open={openCreate} setOpen={setOpenCreate}/>
      <Title handleCreate={handleCreate} handleEdit={handleEdit}/>
      {links.length > 0 ?
        <Links links={links} showEdit={showEdit} setOpenCreate={setOpenCreate}/>
        :
        <NoneImg/>
      }
    </Styled.ContentWrapper>
  );
})

const Links = React.memo(({
                            links,
                            showEdit,
                            setOpenCreate
                          }: { links: Link[], showEdit: boolean, setOpenCreate: Function }) => {
  return <Styled.WebSiteItemsWrapper>
    {links.map((v, k) => {
      return <Items key={k} showEdit={showEdit} v={v}/>
    })}
    <Add setOpenCreate={setOpenCreate}/>
  </Styled.WebSiteItemsWrapper>
})

const Add = React.memo(({setOpenCreate}: { setOpenCreate: Function }) => {
  const {isOwner} = useOwnerStore()
  return <Styled.WebSiteItemPlusWrapper style={{display: isOwner ? 'flex' : "none"}}
                                        onClick={() => setOpenCreate(true)}>
    <AddIcon/>
  </Styled.WebSiteItemPlusWrapper>
})

const AddIcon = React.memo(() => <Styled.WebSiteItemPlus>+</Styled.WebSiteItemPlus>)

const Items = React.memo(({showEdit, v}: { showEdit: boolean, v: Link }) => <WebSiteItem isShowEdit={showEdit}
                                                                                         link={v}/>)

const NoneImg = React.memo(() => {
  return <Styled.NonWebSiteItemsWrapper>
    <img src={"/img_8.png"} style={{
      display: "flex", width: "36.9rem",
      height: "34.0rem", marginTop: "1.0rem"
    }}/>
  </Styled.NonWebSiteItemsWrapper>
})


const Title = React.memo(({
                            handleCreate,
                            handleEdit
                          }: { handleCreate: React.MouseEventHandler<HTMLDivElement>, handleEdit: React.MouseEventHandler<HTMLDivElement> }) => {
  const {isOwner} = useOwnerStore()
  const {t} = useTranslation()

  return <Styled.TitleWrapper>
    <div style={{display: "flex", alignItems: "center"}}>
      <WebSiteText/>
      <NewButton style={{display: isOwner ? "flex" : 'none'}} padding={"0.8rem 2.2rem"}
                 content={`+ ${t("Profile.create_link")} `}
                 onClick={handleCreate}/>
      <Gap width={24}/>
      <NewButton style={{display: isOwner ? "flex" : 'none'}} padding={"0.8rem 1.3rem"}
                 content={`${t("Profile.edit_link")}`}
                 onClick={handleEdit}/>
    </div>
  </Styled.TitleWrapper>
})


const WebSiteText = React.memo(() => {
  const {t} = useTranslation()
  return <Styled.Text_L>{t("Profile.website")}</Styled.Text_L>
})

