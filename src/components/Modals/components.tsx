import React, {useEffect, useState} from "react";
import {LoginStyles as Styled} from "@/components/Modals/PermissionManagementModal/styles";
import {LoginStyles as Styles} from "@/components/Modals/PermissionManagementModal/Components/Item/styles";
import {useTranslation} from "react-i18next";
import {Profile__1} from "@/did/model/Profile";
import {Gap} from "@/components";
import Button from "antd/es/button";

export const Footer = React.memo((props: { clear?: React.MouseEventHandler<Element>, handleClick?: React.MouseEventHandler<Element> }) => {
  const {clear, handleClick} = props

  const handleCancel = (e) => {
    clear?.(e)
  }

  const handleConfirm = e => {
    handleClick?.(e)
  }

  return <div style={{textAlign: 'center'}}>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '20%'
    }}>
      {clear && <ModalButton onClick={handleCancel} isCancel={true}/>}
      {handleClick && <ModalButton onClick={handleConfirm} isCancel={false}/>}
    </div>
  </div>
})

export const Role = React.memo((props: { role: string, T: Function }) => {
  const {role, T} = props
  return <Styled.CurrentRole>
    <Styled.TopText>{T("identity") + ": "}</Styled.TopText>
    <div style={{width: '2rem'}}/>
    <Styled.RoleOwner>{role}</Styled.RoleOwner>
  </Styled.CurrentRole>
})

const ModalButton = React.memo(({onClick, isCancel}: {
    isCancel: boolean,
    onClick: React.MouseEventHandler
  }) => {
    const {t} = useTranslation()
    return <Button onClick={onClick} style={{
      gap: '1.0rem',
      color: 'white',
      background: isCancel ? "grey" : "#4E4597",
      width: '30%',
      borderRadius: '1.0rem',
      height: '4.5rem',
      marginRight: '2.0rem',
      marginLeft: '2.0rem',
    }}>
      {isCancel ? t("Modal.button_cancel") : t("Modal.button_confirm")}
    </Button>
  }
)


export const OtherItemView = React.memo((props: { isOwner: boolean, goto: React.MouseEventHandler<HTMLDivElement>, info: Profile__1 | undefined, handleCancel: React.MouseEventHandler<HTMLDivElement> }) => {
  const {goto} = props

  return <Styles.Body onClick={goto}>
    <Comp {...props}/>
    <Button_1 {...props} />&nbsp;
  </Styles.Body>
})

const Comp = React.memo(({info}: { info?: Profile__1 }) => {
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (info?.avatar_url) {
      fetch(info?.avatar_url).then(e => {
        if (e.ok) setUrl(info?.avatar_url)
        else setUrl("")
      })
    }
  }, [info])

  return <>
    <Gap width={20}/>
    <Styles.Avatar url={url}/>
    <Gap width={20}/>
    <div style={{flex: "1 1 .0rem"}}>
      <Styles.Name>{info?.name}</Styles.Name>
      <Styles.Name style={{opacity: "0.8", fontSize: "1.0rem"}}>{info?.description}</Styles.Name>
    </div>
    <Gap width={20}></Gap>
  </>
})

const Button_1 = React.memo(({
                               handleCancel,
                               isOwner
                             }: { isOwner: boolean, handleCancel: React.MouseEventHandler<HTMLDivElement> }) => {
  return <>
    {isOwner ?
      <Styles.RoleShared isHover={true} onClick={handleCancel}>{"Delete"}</Styles.RoleShared>
      : <Styled.RoleOwner isHover={true} onClick={handleCancel}>{"Delete"}</Styled.RoleOwner>
    }
  </>
})

