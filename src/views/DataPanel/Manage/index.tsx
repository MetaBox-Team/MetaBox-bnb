import React, {useState} from "react";
import {ManageStyles as Styled} from "./styles"
import {BoxList, Table} from "./components"
import {NewButton, Refresh} from "@/components";
import {useBoxesStore, useOwnerStore, useProfileStore} from "@/redux";
import {MBApi} from "@/api";
import {desensitizationPrincipal} from "@/utils/formate";
import {Header} from "@/components/Header";
import {useTranslation} from "react-i18next";
import {RecentDownload} from "@/views/DataPanel/Manage/components/RecentDownload";
import {CheckBalanceModal} from "@/components/Modals/CheckBalanceModal";
import {toast} from "react-toastify";

export function Manage() {
  const [mode, setMode] = useState(true)
  const [openCheck, setOpenCheck] = useState(false)
  const {isOwner} = useOwnerStore()
  const {need_icp} = useBoxesStore()

  const needICP = React.useMemo(() => {
    if (need_icp) {
      const icp = ((need_icp / 1e8) + 0.01).toFixed(2)
      return Number(icp)
    } else return 0
  }, [need_icp])

  const handleClick = React.useCallback(async () => {
    if (needICP) setOpenCheck(true)
    else toast.warning("please try again later")
  }, [needICP])

  return (
    <Styled.MainContainer>
      <CheckBalanceModal needICP={needICP} open={openCheck} setOpen={setOpenCheck}/>
      <Header isNeedIcon={false}/>
      <Welcome isOwner={isOwner}/>
      <Middle isOwner={isOwner} mode={mode} setMode={setMode} handleClick={handleClick}/>
      <Styled.BottomWrap isOwner={isOwner}>
        {mode ? <Table/> : <BoxList/>}
        <RecentDownload/>
      </Styled.BottomWrap>
    </Styled.MainContainer>
  );
}

const Middle = React.memo(({
                             isOwner,
                             handleClick,
                             mode,
                             setMode
                           }: { isOwner?: boolean, handleClick: React.MouseEventHandler<HTMLDivElement>, mode: boolean, setMode: Function }) => {
  const {t} = useTranslation()


  return <Styled.MiddleWrap isOwner={isOwner}>
    <Styled.MiddleWrapLeft>
      <MiddleLeft isOwner={isOwner} handleClick={handleClick}/>
      {isOwner && <Styled.ChangeIcon onClick={() => setMode(!mode)}/>}
    </Styled.MiddleWrapLeft>
    {isOwner && `${t("DataPanel.recently_download")}`}
  </Styled.MiddleWrap>
})


const MiddleLeft = React.memo(({
                                 isOwner,
                                 handleClick
                               }: { isOwner?: boolean, handleClick: React.MouseEventHandler<HTMLDivElement> }) => {
  const {t} = useTranslation()
  const {user_principal} = useOwnerStore()
  const handleRefresh = React.useCallback(async () => {
    await MBApi.getBoxes(user_principal)
  }, [user_principal])

  return <div style={{display: 'flex', height: "100%", alignItems: "center"}}>
    {t("DataPanel.box_list")} &nbsp;
    <NewButton style={{display: isOwner ? 'flex' : "none"}} padding={"0.8rem 1.3rem"} onClick={handleClick}
               content={`+ ${t("DataPanel.create_Box")}`}/>&nbsp;
    <Refresh handleRefresh={handleRefresh}/>
  </div>
})

const Welcome = React.memo(({isOwner}: { isOwner?: boolean }) => {
  const {name} = useProfileStore()
  const {t} = useTranslation()

  const short_name = React.useMemo(() => {
    return name && name.length > 10 ? desensitizationPrincipal(name, 4) : name
  }, [name])
  return <Styled.Panel>
    <Styled.Img/>
    <Styled.WelcomeText>{isOwner ? `${t("DataPanel.welcome_back")} ${short_name}!` : `Welcome to ${short_name}'s panel`}</Styled.WelcomeText>
    <Styled.Description>Data is another interpretation of life.....</Styled.Description>
  </Styled.Panel>
})

