import React, {useState} from "react";
import {HeaderStyles as Styled} from "./styles"
import Icon from "@/icons/Icon";
import {useHistory} from "react-router-dom";
import i18n from "i18next";
import {useAuth} from "@/usehooks/useAuth";
import Tooltip from "antd/es/tooltip";
import {useTranslation} from "react-i18next";

const currentLanguage = {
  'en': "English",
  'zh': "中文简体",
  'ri': "日本語",
  'yn': "Tiếng Việt"
}

const LanguageArr = Object.keys(currentLanguage)

export const Header = React.memo(({isNeedIcon, onClick}: { isNeedIcon: boolean, onClick?: Function }) => {
  const [isShow, setIsShow] = useState(false)
  const CurrentLanguage = React.useMemo(() => {
    return currentLanguage[i18n.language]
  }, [i18n.language])

  return (
    <Styled.Header>
      <Back isNeedIcon={isNeedIcon} onClick={onClick}/>
      <div style={{display: 'flex', gap: "2rem"}}>
        <Styled.LanguageWrap>
          <ICON/>&nbsp;
          <ChangeText setIsShow={setIsShow} language={CurrentLanguage}/>
          <DropdownWrap setIsShow={setIsShow} isShow={isShow}/>
        </Styled.LanguageWrap>
        <LogOut/>
      </div>
    </Styled.Header>
  );
})

const LogOut = React.memo(() => {
  const {logOut} = useAuth()
  const {t} = useTranslation()
  const handler = React.useCallback(() => {
    logOut?.()
  }, [logOut])

  return <Tooltip title={t("LogIn.logout")}>
    <div onClick={handler} style={{cursor: 'pointer'}}>
      <Icon name={"log_out"}/>
    </div>
  </Tooltip>
})

const DropdownWrap = React.memo(({isShow, setIsShow}: { isShow: boolean, setIsShow: Function }) => {

  const OtherLanguage = React.useMemo(() => {
    return LanguageArr.filter(e => e !== i18n.language)
  }, [i18n.language])

  const handleChange = React.useCallback((language) => {
    return () => {
      setIsShow(false)
      i18n.changeLanguage(language).then()
    }
  }, [])

  return <Styled.DropdownWrap isShow={isShow}>
    {OtherLanguage.map((k, v) => {
      return <Item key={v} k={k} handleChange={handleChange}/>
    })}
  </Styled.DropdownWrap>
})

const Item = React.memo(({handleChange, k}: { handleChange: Function, k: string }) => {
  return <Styled.DropdownItem onClick={handleChange(k)}>{currentLanguage[k]}</Styled.DropdownItem>
})

const ChangeText = React.memo(({setIsShow, language}: { setIsShow: Function, language: string }) => {
  return <Styled.ChangeText onClick={() => setIsShow(true)}>{language}</Styled.ChangeText>
})

const ICON = React.memo(() => <Icon name={"earth"}/>)

const Back = React.memo(({isNeedIcon, onClick}: { isNeedIcon: boolean, onClick?: Function }) => {
  const history = useHistory()
  return <Styled.HeaderIcon onClick={() => {
    history.goBack()
    onClick?.()
  }} isNeed={isNeedIcon}>
    <Icon name={"back"}/>
  </Styled.HeaderIcon>
})
