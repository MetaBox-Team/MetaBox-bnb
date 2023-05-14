import Drawer from 'antd/es/drawer';
import React from 'react';
import {DetailDrawerStyles as Styled} from "./styles"
import {AssetExt} from "@/did/model/DataBox";
import {sharedType} from "@/redux";
import {useTranslation} from "react-i18next";

interface Props {
  open: boolean
  setOpen: Function
  fileExt?: AssetExt
  sharedFile?: sharedType
}

export const DetailDrawer = React.memo(({open, setOpen, fileExt, sharedFile}: Props) => {
    const {t} = useTranslation()

    const Translate = (anchor: string) => {
      return t(`DataBox.Drawer.${anchor}`)
    }

    const file = fileExt ? fileExt : sharedFile

    const onClose = React.useCallback(() => {
      setOpen(false)
    }, [])

    return (
      <Drawer
        placement={"right"}
        width={"80rem"}
        onClose={onClose}
        open={open}
        drawerStyle={{backgroundColor: "#F2F8FE"}}
        closable={false}
        bodyStyle={{padding: "4.0rem 3.0rem 0 4.0rem", display: "flex", flexDirection: "column"}}>
        <Styled.TittleWrap>{Translate("file_detail")}</Styled.TittleWrap>
        <Styled.ItemWrap>
          <Styled.ItemLeft>{Translate("file_name")}</Styled.ItemLeft>
          <Styled.ItemRight>{file?.file_name}</Styled.ItemRight>
        </Styled.ItemWrap>
        <Styled.ItemWrap>
          <Styled.ItemLeft>{Translate("file_type")}</Styled.ItemLeft>
          <Styled.ItemRight>{file?.file_extension}</Styled.ItemRight>
        </Styled.ItemWrap>
        <Styled.ItemWrap>
          <Styled.ItemLeft>{Translate("file_key")}</Styled.ItemLeft>
          <Styled.ItemRight>{file?.file_key}</Styled.ItemRight>
        </Styled.ItemWrap>
        <Styled.ItemWrap>
          <Styled.ItemLeft>{Translate("box_id")}</Styled.ItemLeft>
          <Styled.ItemRight>{fileExt ? fileExt.bucket_id.toString() : sharedFile?.other.toString()}</Styled.ItemRight>
        </Styled.ItemWrap>
        <Styled.ItemWrap>
          <Styled.ItemLeft>{Translate("file_location")}</Styled.ItemLeft>
          <Styled.ItemRight>{file?.page_field ? String(Object.keys(file?.page_field)[0]) : ""}</Styled.ItemRight>
        </Styled.ItemWrap>
        <Styled.ItemWrap>
          <Styled.ItemLeft>{Translate("file_creator")}</Styled.ItemLeft>
          <Styled.ItemRight>{fileExt ? fileExt.owner.toString() : sharedFile?.description}</Styled.ItemRight>
        </Styled.ItemWrap>
        {sharedFile && <Styled.ItemWrap>
          <Styled.ItemLeft>{Translate("file_receiver")}</Styled.ItemLeft>
          <Styled.ItemRight>{sharedFile.receiver.toString()}</Styled.ItemRight>
        </Styled.ItemWrap>}
        {fileExt &&
          <>
            <Styled.ItemWrap>
              <Styled.ItemLeft>{Translate("file_share_others")}</Styled.ItemLeft>
              <Styled.ItemRight>
                <div style={{display: "flex", flexDirection: "column"}}>
                  {fileExt?.share_other.map((v, k) => {
                    return <Styled.ItemRight
                      style={{display: v.toString() === fileExt.owner.toString() ? "none" : "flex"}}
                      key={k}>{v.toString()}</Styled.ItemRight>
                  })}
                </div>
              </Styled.ItemRight>
            </Styled.ItemWrap>
            <Styled.ItemWrap>
              <Styled.ItemLeft>{Translate("file_size")}</Styled.ItemLeft>
              <Styled.ItemRight>{Number(fileExt?.total_size)}</Styled.ItemRight>
            </Styled.ItemWrap>
            <Styled.ItemWrap>
              <Styled.ItemLeft>{Translate("file_aes_key")}</Styled.ItemLeft>
              <Styled.ItemRight>{fileExt?.aes_pub_key[0] ? fileExt?.aes_pub_key[0] : "-"}</Styled.ItemRight>
            </Styled.ItemWrap>
          </>
        }
      </Drawer>
    )
  }
)
