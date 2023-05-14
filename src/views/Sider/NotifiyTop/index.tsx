import React, {useEffect, useState} from 'react';
import {NotifyTopStyles as Styled} from "./styles";
import {ShareResponse, UnhandledEmail} from "@/api";
import {UnhandledItem} from "@/views/Sider/UnhandledItem";
import {ShareResponseItem} from "@/views/Sider/ShareResponseItem";
import Spin from "antd/es/spin"
import {get_other_info_2} from "@/utils/common";
import {Profile__1} from "@/did/model/Profile";
import Icon from "@/icons/Icon";
import {useTranslation} from "react-i18next";
import {AddFileToBoxModal} from "@/components/Modals/SelectBoxModal/AddFileToBoxModal";

export const NotifyTop = React.memo(({
                                       isShow,
                                       unhandledEmail,
                                       response,
                                       setIsShow
                                     }: { isShow: boolean, unhandledEmail?: UnhandledEmail[], response?: ShareResponse[], setIsShow: Function }) => {
  const [openSelectBox, setOpenSelectBox] = useState(false)
  const [emailItem, setEmailItem] = useState<UnhandledEmail>()
  const [unhandleInfo, setUnhandledInfo] = useState<Profile__1[]>()
  const [responseInfo, setResponseInfo] = useState<Profile__1[]>()
  const openSelect = React.useCallback((v: UnhandledEmail) => {
    setOpenSelectBox(true)
    setEmailItem(v)
  }, [])

  const get_unhandled_info = async () => {
    if (unhandledEmail) {
      const from_arr: string[] = []
      unhandledEmail.forEach(e => from_arr.push(e.from))
      const {info_arr} = await get_other_info_2(from_arr)
      setUnhandledInfo(info_arr)
    }
  }

  const get_response_info = async () => {
    if (response) {
      const from_arr: string[] = []
      response.forEach(e => from_arr.push(e.from))
      const {info_arr} = await get_other_info_2(from_arr)
      setResponseInfo(info_arr)
    }
  }

  useEffect(() => {
    isShow && get_unhandled_info()
    isShow && get_response_info()
  }, [unhandledEmail, response, isShow])


  return (
    <Styled.ContentWrap isShow={isShow}>
      <Head close={setIsShow}/>
      <AddFileToBoxModal email={emailItem} open={openSelectBox} setOpen={setOpenSelectBox}/>
      <Styled.StreamWrap>
        {/* Item class */}
        <Spin spinning={!(!!unhandleInfo && !!responseInfo)}>
          {unhandledEmail?.map((v, k) => {
            return <UnhandledItem info={unhandleInfo?.[k]} openSelect={openSelect} key={k} v={v}
                                  k={k}/>
          })}
          {response?.map((v, k) => {
            return <ShareResponseItem info={responseInfo?.[k]} key={k} v={v} k={k}/>
          })}
        </Spin>
      </Styled.StreamWrap>
    </Styled.ContentWrap>
  );
})

const Head = React.memo(({close}: { close: Function }) => {
  const {t} = useTranslation()
  return <Styled.TitleWrap>{t("Notify.title")}
    <Styled.CloseIcon onClick={() => close(false)}>
      <Icon name={"close"}/>
    </Styled.CloseIcon>
  </Styled.TitleWrap>
})

