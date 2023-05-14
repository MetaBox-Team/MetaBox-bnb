import React, {useEffect, useState} from 'react';
import {TableStyles as Styled} from "@/views/DataPanel/Manage/components/Table/styles";
import {BoxAllInfo} from "@/did/model/MBox";
import {useBoxesStateStore, useBoxesStore, useOwnerStore} from "@/redux";
import {useAuth} from "@/usehooks/useAuth";
import {toast} from "react-toastify";
import {useHistory, useParams} from "react-router-dom";
import {Capacity, CycleBalance, ManageWrap, More, State, Unite, UpgradeWrap} from "./components";
import {useTranslation} from "react-i18next";
import {DataBoxApi} from "@/api";

export const Item = React.memo(({
                                  k,
                                  v,
                                  setClickOne,
                                  setOpenUpgrade,
                                  handleManage,
                                  handleEvents
                                }: { handleEvents: Function, handleManage: Function, setOpenUpgrade: Function, setClickOne: Function, k: number, v: BoxAllInfo }) => {
  const {isOwner} = useOwnerStore()
  const {principal} = useAuth()
  const {allVersion, isMint} = useBoxesStore()
  const boxesState = useBoxesStateStore();
  const {t} = useTranslation()
  const {user}: { user: string } = useParams()
  const history = useHistory();


  const {cycle, memory} = React.useMemo(() => {
    const state = boxesState?.[k]
    const memory = state ? Number(state?.ok.memory_size) + Number(state?.ok.stable_memory_size) : 0
    const cycle = state ? Number(state.ok.balance) : 0;
    return {cycle, memory}
  }, [boxesState, allVersion, k])


  const handleClick = React.useCallback((v: BoxAllInfo) => {
    return () => {
      if (Object.keys(v.status)[0] === "running") {
        if (cycle === 0) toast.warning(`The Box cycles are insufficient`)
        else history.push(`/databox/${v.canister_id.toString()}/${user}/${k}`)
      } else toast.warning(t("toast.start_box"))
    }
  }, [user, cycle, k, t])

  const normal = React.useMemo(() => {
    return {k, v, principal, memory, cycle, isOwner, isMint}
  }, [k, v, principal, memory, cycle, isOwner, isMint])

  return <Styled.Test_Table_Item key={k} onClick={handleClick(v)}>
    <Unite  {...normal} isMint={isMint ? isMint[k] : false}/>
    <CycleBalance {...normal}/>
    <State {...normal}/>
    <Capacity memory={memory}/>
    <Styled.ActionButtonWrapper>
      <UpgradeWrap {...normal} setOpenUpgrade={setOpenUpgrade} setClickOne={setClickOne}/>
      <ManageWrap {...normal} isOwner={isOwner} handleManage={handleManage}/>
      <More {...normal} handleEvents={handleEvents}/>
    </Styled.ActionButtonWrapper>
  </Styled.Test_Table_Item>
})
