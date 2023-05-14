import React, {useEffect, useState} from 'react';
import {Header} from "@/components/Header";
import {FollowsStyles as Styled} from "@/views/Profile/components/Following/Follows/styles";
import Icon from "@/icons/Icon";
import {Profile__1} from "@/did/model/Profile";
import {useFollowingStore} from "@/redux/features/following";
import {RequestApi, User} from "@/api";
import {useBoxesStore, useOwnerStore} from "@/redux";
import {useAuth} from "@/usehooks/useAuth";
import {toast} from "react-toastify";
import {get_other_info} from "@/utils/common";
import {Skeleton} from "@mui/material";
import {NewButton, NormalDialogModal} from "@/components";
import {useTranslation} from "react-i18next";


export function Follower() {
  const [idArr, setIdArr] = useState<Profile__1[]>()
  const {followers} = useFollowingStore()
  const get_id = async () => {
    if (followers) {
      setIdArr(undefined)
      const {info_arr} = await get_other_info(followers)
      setIdArr(info_arr)
    }
  }

  useEffect(() => {
    get_id()
  }, [followers])

  return (
    <Styled.MainContainer>
      <Header isNeedIcon={true}/>
      <Pure/>
      <Styled.MainPanel>
        <PanelHeader/>
        <Styled.ListItemWrap>
          {!idArr ? <Loading/>
            : followers?.map((v, k) => <Main v={v} key={k} k={k} idArr={idArr}/>)
          }
        </Styled.ListItemWrap>
      </Styled.MainPanel>
    </Styled.MainContainer>
  );
}

const Loading = React.memo(() => {
  const arr = new Array(3).fill(0)

  return <>
    {arr.map((v, k) => <Skeleton key={k} variant="rectangular" width="100%" height="12rem"
                                 style={{marginBottom: "1.0rem", borderRadius: "1.2rem"}}/>)}
  </>
})

const Main = React.memo(({k, idArr, v}: { k: number, idArr: Profile__1[], v: User }) => {
  const [openTip, setOpenTip] = useState(false)
  const {principal} = useAuth()
  const {profile} = useBoxesStore()
  const {t} = useTranslation()

  const deleteFan = (who: User) => {
    return React.useCallback(() => {
      if (principal && profile) {
        RequestApi.cancel_follow({
          follower_principal: who.principal,
          follower_canister_id: who.canister_id,
          followed_principal: String(principal),
          followed_canister_id: profile,
        }).then(e => {
          if (e) {
            RequestApi.get_follow_db(principal)
            toast.success("success")
          }
        })
      }
    }, [who, principal, profile])
  }

  return <>
    <NormalDialogModal onOK={deleteFan(v)} open={openTip} setOpen={setOpenTip} title={t("Follow.modal_title")}
                       description={t("Follow.modal_title")} isLink={false}/>
    <Styled.ListItem key={k} onClick={() => window.open(`/${v.principal}`)}>
      <Pic user={idArr[k]}/>
      <Button setOpenTip={setOpenTip} idArr={idArr} v={v}/>
    </Styled.ListItem>
  </>
})

export const Pic = React.memo(({user}: { user: Profile__1 }) => {
  const {t} = useTranslation()
  return <div style={{display: 'flex', height: '100%', alignItems: 'center'}}>
    <Styled.ListItemPic url={user.avatar_url.split('avatar/')[1] ? user.avatar_url : ''}/>
    <Styled.ListMsg>
      <Styled.ListMsgTitle>{user.name}</Styled.ListMsgTitle>
      <Styled.ListMsgInfo>{user.description ? user.description : t("Follow.no_description")}</Styled.ListMsgInfo>
    </Styled.ListMsg>
  </div>
})

const Button = React.memo(({idArr, v, setOpenTip}: { setOpenTip: Function, idArr?: Profile__1[], v: User }) => {
  const {isOwner} = useOwnerStore()
  const {following} = useFollowingStore()
  const {principal} = useAuth()
  const {profile} = useBoxesStore()
  const {t} = useTranslation()

  const following_principal = React.useMemo(() => {
    const following_principal: string[] = []
    following?.forEach(e => following_principal.push(e.principal))
    return following_principal
  }, [following])

  const handleFollowBack = (who: User) => {
    return (e) => {
      e.stopPropagation()
      if (principal && profile) {
        RequestApi.follow({
          follower_principal: String(principal),
          follower_canister_id: profile,
          followed_principal: who.principal,
          followed_canister_id: who.canister_id,
        }).then(e => {
          if (e) {
            RequestApi.get_follow_db(principal)
            toast.success("success")
          }
        })
      }
    }
  }

  return <div style={{display: isOwner ? 'flex' : 'none'}}>
    <NewButton
      style={{display: idArr && isOwner && !following_principal?.includes(v.principal) ? 'flex' : 'none'}}
      onClick={handleFollowBack(v)} content={t("Follow.Followers.follow")} padding={"1.2rem"}/>
    <div style={{width: "2rem"}}/>
    <NewButton style={{display: idArr && isOwner ? 'flex' : 'none'}}
               onClick={(e) => {
                 e.stopPropagation();
                 setOpenTip(true)
               }} padding={"1.2rem"} content={t("Follow.Followers.delete_fan")}/>
  </div>
})

export const PanelHeader = React.memo(() => {
  const [clickOne, setClickOne] = useState(0)
  const {t} = useTranslation()
  const table_head = [t("Follow.all_members")]
  return <Styled.PanelHeader>
    <Styled.Bottonwidgets>
      {table_head.map((v, k) => {
        return <Styled.PanelHeaderBotton key={k} onClick={() => setClickOne(k)}
                                         isSelect={clickOne === k}>{v}</Styled.PanelHeaderBotton>
      })}
    </Styled.Bottonwidgets>
    {/*<Pure_1/>*/}
  </Styled.PanelHeader>
})

const Pure = React.memo(() => {
  const {t} = useTranslation()
  return <Styled.TextContent>{t("Follow.Followers.followers")}</Styled.TextContent>
})
const Pure_1 = React.memo(() => <Styled.PanelHeaderBottonRight>
  <Icon name={"list"}/>
</Styled.PanelHeaderBottonRight>)
