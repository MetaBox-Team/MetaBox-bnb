import React, {useEffect, useState} from "react";
import {FollowsStyles as Styled} from "./styles"
import {Header} from "@/components/Header";
import {useFollowingStore} from "@/redux/features/following";
import {RequestApi, User} from "@/api";
import {Profile__1} from "@/did/model/Profile";
import {useAuth} from "@/usehooks/useAuth";
import {toast} from "react-toastify";
import {useBoxesStore, useOwnerStore} from "@/redux";
import {get_other_info} from "@/utils/common";
import {PanelHeader, Pic} from "@/views/Profile/components/Follower";
import {Skeleton} from "@mui/material";
import {NewButton, NormalDialogModal} from "@/components";
import {useTranslation} from "react-i18next";

export function Follows() {
  const [idArr, setIdArr] = useState<Profile__1[]>()
  const {following} = useFollowingStore()
  const get_id = async () => {
    if (following) {
      setIdArr(undefined)
      const {info_arr} = await get_other_info(following)
      setIdArr(info_arr)
    }
  }


  useEffect(() => {
    get_id()
  }, [following])
  return (
    <Styled.MainContainer>
      <Header isNeedIcon={true}/>
      <Pure_1/>
      <Styled.MainPanel>
        <PanelHeader/>
        <Styled.ListItemWrap>
          {!idArr ? <Loading/> :
            following?.map((v, k) => {
              return <Item key={k} k={k} v={v} idArr={idArr}/>
            })}
        </Styled.ListItemWrap>
      </Styled.MainPanel>
    </Styled.MainContainer>
  );
}

const Item = React.memo((props: { k: number, v: User, idArr: Profile__1[] }) => {
  const {k, v, idArr} = props
  const [openTip, setOpenTip] = useState(false)
  const {principal} = useAuth()
  const {profile} = useBoxesStore()
  const {t} = useTranslation()

  const handleCancelFollow = (who: User) => {
    return React.useCallback(() => {
      if (principal && profile) {
        RequestApi.cancel_follow({
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
    }, [who, principal, profile])
  }

  return <>
    <NormalDialogModal onOK={handleCancelFollow(v)} open={openTip} setOpen={setOpenTip} title={t("Follow.modal_title")}
                       description={t("Follow.confirm_modal")} isLink={false}/>
    <Styled.ListItem onClick={() => window.open(`/${v.principal}`)}>
      <Pic user={idArr[k]}/>
      <Button idArr={idArr} setOpenTip={setOpenTip}/>
    </Styled.ListItem>
  </>
})

const Loading = React.memo(() => {
  const arr = new Array(3).fill(0)

  return <>
    {arr.map((v, k) => <Skeleton key={k} variant="rectangular" width="100%" height="12rem"
                                 style={{marginBottom: "1.0rem", borderRadius: "1.2rem"}}/>)}
  </>
})


const Pure_1 = React.memo(() => {
  const {t} = useTranslation()
  return <Styled.TextContent>{t("Follow.Followings.followings")}</Styled.TextContent>
})

const Button = React.memo(({idArr, setOpenTip}: { setOpenTip: Function, idArr?: Profile__1[] }) => {
  const {isOwner} = useOwnerStore()
  const [isHover, setIsHover] = useState(false)
  const {t} = useTranslation()

  const handleClick = React.useCallback((e) => {
    e.stopPropagation()
    setOpenTip(true)
  }, [])

  return <NewButton setIsHover={setIsHover}
                    style={{display: idArr && isOwner ? "flex" : "none", backgroundColor: isHover ? "red" : "#4E4597"}}
                    onClick={handleClick}
                    content={isHover ? t("Follow.Followings.unfollow") : t("Profile.button_following")}
                    padding={"1.2rem"}/>
})
