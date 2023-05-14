import React from 'react';
import {BannerStyles as Styled} from "./styles"
import {useAuth} from "@/usehooks/useAuth";
import {useOwnerStore} from '@/redux';
import {OGApi} from '@/api/OGApi';
import {useTranslation} from "react-i18next";

const V1_url =
  // "http://localhost:3001/page/V1toV2"
  "https://o6fpj-2yaaa-aaaao-aafnq-cai.ic0.app/"
// "https://t.me/+iciBoFSeyYdmNTA1"
let v2_window: Window | null
export const Banner = React.memo(() => {
  const {principal} = useAuth()
  const {isOwner} = useOwnerStore()
  const {t} = useTranslation()
  const handleClick = React.useCallback(() => {
    v2_window = window.open(V1_url)
    // window.addEventListener("message", handler)
  }, [])

  const handler = (message: MessageEvent<any>) => {
    if (message.data.message === "Ready") {
      v2_window && v2_window.postMessage({type: "MetaBox_v2", message: String(principal)}, "*")
    } else if (message.data.type === "MetaBox_v1_Transfer_complete") {
      principal && OGApi.getOgNum(principal).then()
      window.removeEventListener("message", handler)
    }
  }
  return <Styled.TheBanner style={{display: isOwner ? "flex" : "none"}}>
    <Styled.BannerContent onClick={handleClick}>
      <Styled.BannerText>{t("Banner.tip_1")}.....</Styled.BannerText>
    </Styled.BannerContent>
  </Styled.TheBanner>
})
