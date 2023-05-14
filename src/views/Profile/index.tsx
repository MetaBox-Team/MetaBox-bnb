import React, {useEffect} from "react";
import {ProfileStyles as Styled} from "@/views/Profile/styles";
import {UserInfo} from "./components/UserInfo";
import {WebSite} from "./components/WebSite"
import {RequestApi} from "@/api";
import {useOwnerStore} from "@/redux";
import {Header} from "@/components/Header";

export const Profile = () => {
  const {user_principal} = useOwnerStore()
  useEffect(() => {
    user_principal && RequestApi.get_follow_db(user_principal)
  }, [user_principal])
  return (
    <Styled.ContentWrap>
      <Header isNeedIcon={false}/>
      <UserInfo/>
      <WebSite/>
    </Styled.ContentWrap>
  );
}

