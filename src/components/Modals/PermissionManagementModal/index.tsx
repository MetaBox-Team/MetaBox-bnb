import {Modal} from 'antd';
import {LoginStyles as Styled} from "./styles";
import React, {useCallback, useEffect, useState} from 'react';
import "./index.css";
import {NotOwnerItem, OwnerItem} from "./Components/Item";
import {useAuth} from "@/usehooks/useAuth";
import {BoxAllInfo} from '@/did/model/MBox';
import {Principal} from "@dfinity/principal";
import {DataBoxApi, MBApi, ProfileApi} from '@/api';
import {Gap} from "@/components";
import Spin from "antd/es/spin"
import {get_other_info_2} from "@/utils/common";
import {Profile__1} from "@/did/model/Profile";
import {useTranslation} from "react-i18next";
import {Footer} from "@/components/Modals/components";
import {CacheApi} from "@/api/cache";

export const PermissionManagementModal = React.memo(({
                                                       open,
                                                       setOpen,
                                                       boxItem
                                                     }: { open: boolean, setOpen: Function, boxItem?: BoxAllInfo }) => {
  const {principal} = useAuth()
  const [curController, setCurrentController] = useState<Principal[]>()
  const [idArr, setIdArr] = useState<Profile__1[]>()
  const [ownerInfo, setOwnerInfo] = useState<Profile__1>()
  const {t} = useTranslation()

  const T = useCallback((a: string) => t(`Modal.CancelShareModal.${a}`), [])


  const getOwnerInfo = async () => {
    if (boxItem) {
      let profile_cid: Principal | undefined
      try {
        const profile = await CacheApi.get_profile(boxItem.owner)
        profile_cid = Principal.from(profile)
      } catch (e) {
        profile_cid = await MBApi.getProfile(boxItem.owner)
      }
      if (profile_cid) {
        const profile_api = ProfileApi(profile_cid.toString())
        const info = await profile_api.getProfileInfo()
        setOwnerInfo(info)
      }
    }
  }

  const fetch = async () => {
    if (boxItem) {
      const dataBoxApi = DataBoxApi(boxItem.canister_id.toString())
      const curController = await dataBoxApi.curControl()
      const {info_arr} = await get_other_info_2(curController)
      setIdArr(info_arr)
      setCurrentController(curController)
    }
  }

  useEffect(() => {
    if (open) {
      fetch()
      getOwnerInfo()
    }
  }, [open, boxItem])

  const clean = React.useCallback(() => {
    setIdArr(undefined)
    setOwnerInfo(undefined)
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
          [
            <Footer key={"PermissionManagementModalFooter"} clear={clean}/>
          ]
        }
        open={open}
        closable={false}>
        <Styled.Body className='mainBody'>
          <Role T={T} principal={principal} boxItem={boxItem}/>
          <Gap height={20}/>
          <Spin spinning={!(!!idArr && !!ownerInfo)}>
            {String(principal) === String(boxItem?.owner) ?
              <Styled.Items>
                {curController?.map((v, k) =>
                  <OwnerItem info={idArr?.[k]} key={k} setOpen={setOpen} boxItem={boxItem} to_principal={v}/>)}
                <END/>
              </Styled.Items>
              :
              <NotOwnerItem info={ownerInfo} setOpen={setOpen} boxItem={boxItem} owner={boxItem?.owner}/>
            }
          </Spin>
        </Styled.Body>
      </Modal>
    </>
  )
})

const Role = React.memo((props: { T: Function, principal: Principal | undefined, boxItem?: BoxAllInfo }) => {
  const {T, principal, boxItem} = props
  return <>
    <Styled.CurrentRole>
      <Styled.TopText>{T("identity")}</Styled.TopText>
      <div style={{width: '2rem'}}/>
      {String(principal) === String(boxItem?.owner) ? <Styled.RoleOwner>Owner</Styled.RoleOwner>
        : <Styled.RoleShared>Shared</Styled.RoleShared>}
    </Styled.CurrentRole>
    <Gap height={20}/>
    {/*{String(principal) === String(boxItem?.owner) &&*/}
    {/*  <Styled.Invite>*/}
    {/*    <Styled.InviteText placeholder={T("input_placeholder")}/>*/}
    {/*  </Styled.Invite>*/}
    {/*}*/}
  </>
})

const END = React.memo(() => <Styled.End>-END-</Styled.End>)


