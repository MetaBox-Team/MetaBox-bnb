import React, {useEffect, useState} from 'react';
import {UserInfoStyles as Styled} from "./styles";
import {EditProfileModal, Gap, NewButton, Refresh, TransferUserIdModal} from "@/components";
import {useHistory, useParams} from 'react-router-dom';
import {useBoxesStore, useOwnerStore, useProfileStore} from "@/redux";
import Icon from "@/icons/Icon";
import {useAuth} from '@/usehooks/useAuth';
import {useFollowingStore} from "@/redux/features/following";
import {FollowHandlerArgs, MBApi, RequestApi} from "@/api";
import {Principal} from "@dfinity/principal";
import {desensitizationPrincipal} from "@/utils/formate";
import {toast_api} from "@/utils/T";
import {useTranslation} from "react-i18next";
import {useCache} from "@/usehooks/useCache";

export const UserInfo = React.memo(() => {
  const {avatar_url} = useProfileStore()

  const [openEdit, setOpenEdit] = useState(false)

  return (
    <Styled.ContentWrap>
      <EditProfileModal open={openEdit} setOpen={setOpenEdit}/>
      <Main setOpenEdit={setOpenEdit} avatar_url={avatar_url}/>
    </Styled.ContentWrap>
  );
})

const Main = React.memo(({avatar_url, setOpenEdit}: { avatar_url?: string, setOpenEdit: Function }) => {
  return <Styled.Main>
    <Avatar avatar_url={avatar_url}/>
    <InfoContent setOpenEdit={setOpenEdit}/>
  </Styled.Main>
})

const InfoContent = React.memo(({setOpenEdit}: { setOpenEdit: Function }) => {
  return <Styled.InfoWrap>
    <Info setOpenEdit={setOpenEdit}/>
    <ID/>
    <FollowInfo/>
    <Description/>
  </Styled.InfoWrap>
})

const ID = React.memo(() => {
  const {domain: id} = useCache()
  const [open, setOpen] = useState(false)
  return <Styled.IDWrap>
    <TransferUserIdModal open={open} setOpen={setOpen}/>
    <Styled.Text_S>ID:</Styled.Text_S>
    <Styled.Text_S style={{display: 'flex', alignItems: 'center'}}>
      {id} &nbsp;
      {/*<div onClick={() => setOpen(true)} style={{cursor: "pointer"}}><Icon name={"explain"}/></div>*/}
    </Styled.Text_S>
  </Styled.IDWrap>
})

const Description = React.memo(() => {
  const {description} = useProfileStore()
  return <Styled.Text_SS>{description}</Styled.Text_SS>
})

const Avatar = React.memo(({avatar_url}: { avatar_url?: string }) => {
  return <Styled.Avatar url={avatar_url}/>
})

const FollowInfo = React.memo(() => {
  const {following, followers} = useFollowingStore()
  const {user}: { user: string } = useParams()
  const history = useHistory()
  const {t} = useTranslation()
  const {user_principal} = useOwnerStore()
  const Translate = (anchor: string) => {
    return t(`Profile.${anchor}`)
  }
  const handleRefresh = React.useCallback(async () => {
    user_principal && await RequestApi.get_follow_db(user_principal)
  }, [user_principal])


  return <Styled.FollowInfoWrap>
    <Styled.Text_M>{followers?.length ?? "-"}</Styled.Text_M>
    <Styled.Text_S style={{cursor: "pointer"}}
                   onClick={() => followers && followers.length > 0 && history.push(`/follower/${user}`)}>{Translate("fans")}</Styled.Text_S>
    <Styled.Text_M>{following?.length ?? "-"}</Styled.Text_M>
    <Styled.Text_S style={{cursor: "pointer"}}
                   onClick={() => following && following.length > 0 && history.push(`/following/${user}`)}>{Translate("following")}</Styled.Text_S>
    &nbsp;&nbsp;&nbsp;
    <Refresh handleRefresh={handleRefresh}/>
  </Styled.FollowInfoWrap>
})

const Info = React.memo(({setOpenEdit}: { setOpenEdit: Function }) => {
  const {isOwner, user_principal} = useOwnerStore()
  const {profile} = useBoxesStore()
  const {principal} = useAuth()
  const {t} = useTranslation()
  const {followers} = useFollowingStore()
  const [isHover, setIsHover] = useState(false)
  const [my_profile, setMyProfile] = useState("")

  const get_my_profile = async () => {
    if (principal) {
      const my_profile = await MBApi.getProfile(principal)
      setMyProfile(String(my_profile))
    }
  }

  useEffect(() => {
    principal && get_my_profile()
  }, [principal])

  const Translate = (anchor: string) => {
    return t(`Profile.${anchor}`)
  }

  const content: boolean = React.useMemo(() => {
    const followers_principal_arr: string[] = []
    followers?.forEach(e => followers_principal_arr.push(e.principal))
    return !!followers_principal_arr?.includes(String(principal));
  }, [followers, principal, t])

  const handleClick = React.useCallback(async () => {
    if (principal && user_principal && profile) {
      const arg: FollowHandlerArgs = {
        follower_principal: String(principal),
        follower_canister_id: String(my_profile),
        followed_principal: String(user_principal),
        followed_canister_id: profile,
      }

      if (content) {
        const res = await RequestApi.cancel_follow(arg)
        if (res) RequestApi.get_follow_db(user_principal).then()
      } else {
        const res = await RequestApi.follow(arg)
        if (res) RequestApi.get_follow_db(user_principal).then()
      }
    }
  }, [principal, user_principal, content, my_profile])


  const handleUpgrade = React.useCallback(() => {
    if (profile) {
      const upgrade_promise = MBApi.upgradeBox({
        'status': {'running': null},
        'canister_id': Principal.from(profile) as any,
        'is_private': true,
        'box_name': "",
        'box_type': {'profile': null},
      })
      toast_api(upgrade_promise, "profile", "upgrade")
    }
  }, [])


  return <Styled.UserNameWrap>
    <Name/>
    <Styled.Gap/>
    <EditButton setOpenEdit={setOpenEdit} isOwner={isOwner}/>
    {content && <NewButton setIsHover={setIsHover} onClick={handleClick}
                           style={{display: !isOwner ? "flex" : "none", backgroundColor: isHover ? "red" : "#4E4597"}}
                           padding={"1rem 3rem"}
                           content={isHover ? `- ${Translate("button_unfollow")}` : t("Profile.button_following")}/>}
    {!content && <NewButton onClick={handleClick} style={{display: !isOwner ? "flex" : "none"}} padding={"1rem 3rem"}
                            content={`+ ${Translate("button_follow")}`}/>}
    <Gap width={30}/>
    {/*<NewButton onClick={handleUpgrade} style={{display: isOwner ? "flex" : "none"}} padding={"1rem 3rem"}*/}
    {/*           content={"更新Profile"}/>*/}
  </Styled.UserNameWrap>
})

const Name = React.memo(() => {
  const {name} = useProfileStore()
  return <Styled.Text_UserName>{name && name.length > 10 ? desensitizationPrincipal(name, 3) : name}</Styled.Text_UserName>
})

const EditButton = React.memo(({setOpenEdit, isOwner}: { setOpenEdit: Function, isOwner?: boolean }) => {
  return <div style={{cursor: "pointer", display: isOwner ? "flex" : "none"}}
              onClick={() => setOpenEdit(true)}><Icon
    name={"edit"}/></div>
})

