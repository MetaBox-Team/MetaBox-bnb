import React, {useEffect, useState} from "react";
import {SideStyles as Styled} from "./styles"
import {NotifyTop} from "./NotifiyTop"
import {useHistory, useParams} from "react-router-dom";
import {useEmailStore, useOwnerStore, useProfileStore} from "@/redux";
import Tooltip from "antd/es/tooltip";
import {desensitizationPrincipal} from "@/utils/formate";
import {useTranslation} from "react-i18next";
import {ShareResponse, UnhandledEmail} from "@/api";
import Icon from "@/icons/Icon";
import {useCache} from "@/usehooks/useCache";


export function Side() {
  const [isShow, setIsShow] = useState(false)
  const {isOwner} = useOwnerStore()
  const {unhandledEmail: email, shareResponse: response} = useEmailStore()

  const unhandledEmail = React.useMemo(() => email ?? [], [email])
  const shareResponse = React.useMemo(() => response ?? [], [response])

  const handleEvents = React.useCallback(() => {
    unhandledEmail.length > 0 || shareResponse.length > 0 ? setIsShow(true) : null
  }, [unhandledEmail, shareResponse])

  return (
    <Styled.Wrap>
      {isOwner ? <Logo/> : <BackToHome/>}
      <Items/>
      <Styled.Button>
        <div style={{
          display: isOwner ? 'flex' : "none",
          flexDirection: 'column',
          padding: '0 2.4rem',
          position: "relative"
        }}>
          <MyMessage unhandledEmail={unhandledEmail} shareResponse={shareResponse} handleEvents={handleEvents}/>
          <Info/>
          <NotifyTop response={shareResponse} unhandledEmail={unhandledEmail} isShow={isShow}
                     setIsShow={setIsShow}/> {/* 我的信息 弹窗 示例 */}
        </div>
      </Styled.Button>
    </Styled.Wrap>
  )
}

const BackToHome = React.memo(() => {
  const [isHover, setIsHover] = useState(false)
  const {t} = useTranslation()

  const handleClick = () => location.replace("/")
  return <Styled.Top>
    <Styled.BackHome onClick={handleClick} onMouseEnter={e => setIsHover(true)} onMouseLeave={e => setIsHover(false)}>
      <Icon name="back" width={3} height={3} color={isHover ? "#F2F8FE" : ""}/>
      <div style={{width: "1rem"}}/>
      {t("BackToHome.to_back")}
    </Styled.BackHome>
  </Styled.Top>
})

const MyMessage = React.memo(({
                                unhandledEmail,
                                shareResponse,
                                handleEvents
                              }: { unhandledEmail: UnhandledEmail[], shareResponse: ShareResponse[], handleEvents: React.MouseEventHandler<HTMLDivElement> }) => {
  const {t} = useTranslation()
  return <Tooltip
    title={unhandledEmail && shareResponse && unhandledEmail.length === 0 && shareResponse.length === 0 ? t("ToolTip.no_message") : ""}>
    <Styled.MyInfo onClick={handleEvents}>
      <Styled.MessagePoint
        style={{display: unhandledEmail.length === 0 && shareResponse.length === 0 ? 'none' : "flex"}}/>
      <Styled.EmailIcon/> &nbsp; {t('DataPanel.my_message')}
    </Styled.MyInfo>
  </Tooltip>
})

const Info = React.memo(() => {
  const {name, avatar_url} = useProfileStore()
  const {domain: id} = useCache()
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (avatar_url) {
      fetch(avatar_url).then(e => {
        if (e.ok) setUrl(avatar_url)
      })
    }
  }, [avatar_url])

  const short_name = React.useMemo(() => {
    return name && name.length > 8 ? desensitizationPrincipal(name, 3) : name
  }, [name])

  const short_domain = React.useMemo(() => {
    return id && id.length > 10 ? desensitizationPrincipal(id, 4) : id
  }, [id])

  const test = async () => {

  }
  return <Styled.SideButton>
    <Styled.SideButtonImg url={url}/>
    <Styled.InfoWrap onClick={() => {
      test()
    }
    }>
      <Styled.Name>{short_name}</Styled.Name>
      <Styled.ID>{short_domain}</Styled.ID>
    </Styled.InfoWrap>
  </Styled.SideButton>
})

const Logo = React.memo(() =>
  <Styled.Top>
    <Styled.LogoWrap>
      <Styled.Img/>
      <div style={{width: '2rem'}}/>
      <div style={{
        background: "url(/metabox.jpg) no-repeat center center",
        height: "3rem",
        width: "51%",
        backgroundSize: "cover"
      }}/>
    </Styled.LogoWrap>
  </Styled.Top>
)

const Items = React.memo(() => {
  const [clickOne, setClickOne] = useState(0)
  const {user}: { user: string } = useParams()
  const history = useHistory()
  const {t} = useTranslation()
  const {isOwner} = useOwnerStore()

  const arr = React.useMemo(() => {
    if (isOwner) return ["datapanel", "profile", "deposit"]
    return ["datapanel", "profile"]
  }, [isOwner])

  const index = React.useCallback(() => {
    const pathName = location.pathname.slice(1, location.pathname.length)
    const route = pathName.split("/")[0]
    switch (route) {
      case "datapanel":
      case "databox":
        return 0
      case "profile":
      case "following":
      case "follower":
        return 1
      case "deposit":
        return 2
      default :
        return 0
    }
  }, [location.pathname])

  useEffect(() => {
    setClickOne(index())
  }, [index])

  return <>
    <EmptyItem clickOne={clickOne} k={0}/>
    {arr.map((v, k) => {
      return <Styled.Item key={k}
                          style={{borderRadius: clickOne === k - 1 ? "0 3.3rem 0 0" : clickOne === k ? "0 0 3.3rem 0" : clickOne === k + 1 ? "0 0 3.3rem 0" : " 0"}}>
        <Styled.ItemWrap onClick={() => {
          setClickOne(k)
          history.push(`/${v}/${user}`)
        }} isClick={k === clickOne}>
          {(() => {
            switch (k) {
              case 0:
                return <>{location.href.toLowerCase().includes("databox") ? `${t('DataPanel.data_box')}` : `${t('DataPanel.data_panel')}`}</>
              case 1:
                return <>{t('DataPanel.account')}</>
              case 2:
                return <>Deposit</>
            }
          })()}
        </Styled.ItemWrap>
      </Styled.Item>
    })}
    <EmptyItem clickOne={clickOne} k={arr.length - 1}/>
  </>
})
const EmptyItem = React.memo(({clickOne, k}: { clickOne: number, k: number }) => {
  const arg = React.useMemo(() => {
    if (k === 0) return "0 0 3.3rem 0"
    else return "0  3.3rem 0 0"
  }, [k])

  return <Styled.EmptyItem
    style={{borderRadius: clickOne === k ? arg : "0"}}/>
})
