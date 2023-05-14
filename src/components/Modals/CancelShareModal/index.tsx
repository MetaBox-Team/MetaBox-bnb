import {Button, Modal} from "antd";
import {LoginStyles as Styled} from "@/components/Modals/PermissionManagementModal/styles";
import {Gap} from "@/components";
import React, {useEffect, useState} from "react";
import {ShareItem} from "@/components/Modals/CancelShareModal/Item";
import {get_other_info, get_other_info_2} from "@/utils/common";
import Spin from "antd/es/spin"
import {Profile__1} from "@/did/model/Profile";
import {useTranslation} from "react-i18next";
import {Footer, Role} from "../components";
import {AssetExt} from "@/did/model/DataBox";

export const CancelShareModal = React.memo(({
                                              open,
                                              setOpen,
                                              fileExt
                                            }: { open: boolean, setOpen: Function, fileExt?: AssetExt }) => {

  const [idArr, setIdArr] = useState<Profile__1[]>()
  const {t} = useTranslation()

  const T = React.useCallback((a: string) => t(`Modal.CancelShareModal.${a}`), [t])

  const get_info = async () => {
    try {
      if (fileExt) {
        const {info_arr} = await get_other_info_2(fileExt.share_other)
        setIdArr(info_arr)
      }
    } catch (e) {
      throw e
    }
  }

  useEffect(() => {
    open && get_info()
  }, [open, fileExt])

  const clean = React.useCallback(() => {
    setIdArr(undefined)
    setOpen(false)
  }, [])

  return (
    <>
      <Modal
        maskClosable={false}
        key={'PermissionManagementModal'}
        wrapClassName={'PermissionManagementModal'}
        title={
          [< div style={{color: '#4E4597', textAlign: 'center', fontSize: 25}}
                 key={"PermissionManagementModalTitle"}>{T("title")}</div>]
        }
        width={"60rem"}
        footer={
          [<Footer key={"PermissionManagementModalFooter"} clear={clean}/>]
        }
        open={open}
        closable={false}>
        <Styled.Body className='mainBody'>
          <Role role={"Owner"} T={T}/>
          <Gap height={20}/>
          {/*<Invite T={T}/>*/}
          <Gap height={20}/>
          <Spin spinning={!idArr}>
            <Styled.Items>
              {fileExt?.share_other.map((v, k) => String(fileExt?.owner) === String(v) ? <div key={k}/> :
                <ShareItem info={idArr?.[k]} setOpen={setOpen} fileExt={fileExt} key={k} v={v}/>)}
              <END/>
            </Styled.Items>
          </Spin>
        </Styled.Body>

      </Modal>
    </>
  );
})

const Invite = React.memo(({T}: { T: Function }) => {
  return <Styled.Invite>
    <Styled.InviteText placeholder={T("input_placeholder")}/>
  </Styled.Invite>
})

const END = React.memo(() => <Styled.End>-END-</Styled.End>)

