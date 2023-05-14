import React from "react";
import {TableStyles as Styled} from "@/views/DataPanel/Manage/components/Table/styles";
import {BoxAllInfo} from "@/did/model/MBox";
import {Principal} from "@dfinity/principal";
import Icon from "@/icons/Icon";
import {desensitizationPrincipal, formatNumber} from "@/utils/formate";
import Progress from "antd/es/progress";
import {size_unit, STORE_ONE_MONTH_COST} from "@/utils/common";
import {useBoxesStore} from "@/redux";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import Tooltip from "antd/es/tooltip";
import {PublicTag, Tag} from "@/styles";


export const Unite = React.memo(({
                                   isOwner,
                                   v,
                                   principal, isMint
                                 }: { isOwner?: boolean, v: BoxAllInfo, principal?: Principal, isMint: boolean }) => {
  return <>
    <Tag style={{display: isOwner ? 'flex' : v.is_private ? "flex" : "none"}}
         isOwner={String(v.owner) === String(principal)}>
      {String(v.owner) === String(principal) ? "Owner" : "Shared"}
    </Tag>
    <PublicTag style={{display: isOwner ? "none" : v.is_private ? "none" : "flex"}} isOwner={true}>
      Public
    </PublicTag>
    <Tooltip title={v.is_private ? "private" : ""}>
      <div style={{
        display: v.is_private ? "flex" : "none",
        cursor: "default",
        position: 'absolute',
        top: "0.2rem",
        left: "7rem"
      }}>
        <Icon name={"lock"}/>
      </div>
    </Tooltip>
    <Tooltip title={isMint ? "collection" : "not collection"}>
      <div style={{
        display: "flex",
        cursor: "default",
        position: 'absolute',
        top: "0.2rem",
        left: "9rem"
      }}>
        <Icon name={"collection"} color={isMint ? "#6690FF" : "gray"}/>
      </div>
    </Tooltip>
    <Styled.TableItemText>{v.box_name.length > 10 ? desensitizationPrincipal(v.box_name, 4) : v.box_name}</Styled.TableItemText>
  </>
})

export const CycleBalance = React.memo(({cycle, memory}: { cycle: number, memory: number }) => {
  const {day} = React.useMemo(() => {
    const GbNumber = (memory / (1024 * 1024 * 1024)).toFixed(4);
    const second = cycle / (Number(GbNumber) * 127000);
    const day = Number((second / 86400).toFixed(0))
    return {day}
  }, [cycle, memory])
  const TTL = React.useMemo(() => {
    if (day > 360) {
      return `${(day / 360).toFixed(0)} years`;
    } else if (day > 30) {
      return `${(day / 30).toFixed(0)} months`;
    } else {
      return `${day} days`;
    }
  }, [day])

  return <Styled.TableItemText>&nbsp;&nbsp; {TTL}</Styled.TableItemText>
})

export const State = React.memo(({cycle, memory}: { cycle: number, memory: number }) => {
  const {t} = useTranslation()
  const {storeCost} = React.useMemo(() => {
    const GbNumber = (memory / (1024 * 1024 * 1024)).toFixed(4);
    const storeCost = Number(GbNumber) * STORE_ONE_MONTH_COST;
    return {storeCost}
  }, [cycle, memory])

  return <Styled.StateWrap>
    <Styled.StateWrapTop>
      <Icon name={"point"}
            color={cycle <= storeCost * 3 ? "red" : cycle <= storeCost * 6 ? "orange" : "blue"}/>
      &nbsp;  {cycle <= storeCost * 3 ? t("DataPanel.state_serious") : cycle <= storeCost * 6 ? t("DataPanel.state_shortage") : t("DataPanel.state_active")}
    </Styled.StateWrapTop>
  </Styled.StateWrap>
})

export const Capacity = React.memo(({memory}: { memory: number }) => {

  const {percent} = React.useMemo(() => {
    const GbNumber = (memory / (1024 * 1024 * 1024 * 32)).toFixed(4);
    const percent = Number(GbNumber) * 100;
    return {percent}
  }, [memory])

  return <Styled.CapacityWrap>
    <Progress
      style={{width: "15rem"}}
      percent={percent}
      showInfo={false}
      size={"small"}
      strokeColor={
        percent > 90 ? "red" : percent > 60 ? "orange" : "#0052ff"
      }
    />
    <Styled.CapacityWrapBottom>
      {size_unit(memory)}
      <div style={{color: "#AFAFAF"}}>/30G</div>
    </Styled.CapacityWrapBottom>
  </Styled.CapacityWrap>
})

export const UpgradeWrap = React.memo(({
                                         k,
                                         v,
                                         principal,
                                         setClickOne,
                                         setOpenUpgrade, cycle
                                       }: { cycle: number, k: number, v: BoxAllInfo, principal?: Principal, setClickOne: Function, setOpenUpgrade: Function }) => {
  const {allVersion, data_box_new_version: newVersion} = useBoxesStore()
  const {t} = useTranslation()

  const {version} = React.useMemo(() => {
    let version = allVersion?.[k];
    return {version}
  }, [allVersion])

  const isRunning = React.useMemo(() => {
    return Object.keys(v.status)[0] === "running"
  }, [v])

  const handleClick = () => {
    return (e) => {
      const min_cycles = 0.12 * 1e12
      e.stopPropagation()
      if (version !== undefined && version < 5) {
        setClickOne(k)
        setOpenUpgrade(true)
      } else {
        if (cycle < min_cycles) {
          const need = Number(((min_cycles - cycle) / 1e12).toFixed(2)) + 0.01
          toast.error(`Insufficient cycles, please recharge ${need}T cycles`)
        } else {
          setClickOne(k)
          setOpenUpgrade(true)
        }
      }
    }
  }

  return <>
    {version !== undefined && isRunning && newVersion && version < newVersion && String(v.owner) === String(principal) ?
      <Styled.UpgradeWrap onClick={handleClick()}>
        {t('DataPanel.update_box')}
      </Styled.UpgradeWrap>
      :
      <Styled.UpgradeWrap isNotClick={true}
                          style={{cursor: 'default', backgroundColor: 'gray'}}>{version}</Styled.UpgradeWrap>}
  </>
})

export const ManageWrap = React.memo(({
                                        v,
                                        k,
                                        isOwner,
                                        handleManage, principal
                                      }: { k: number, v: BoxAllInfo, isOwner?: boolean, handleManage: Function, principal?: Principal }) => {
  const {t} = useTranslation()

  const isRunning = React.useMemo(() => Object.keys(v.status)[0] === "running", [v])

  return <>
    {isRunning ? <Styled.ManageWrap style={{display: isOwner ? 'flex' : "none"}} onClick={handleManage(k)}>
        {String(v.owner) === String(principal) ? `${t('DataPanel.manage_box')}` : `${t('DataPanel.show_box')}`}
      </Styled.ManageWrap>
      :
      <Styled.ManageWrap style={{
        color: "white",
        backgroundColor: 'red'
      }}>{t('DataPanel.stop_box')}</Styled.ManageWrap>}

  </>
})
export const More = React.memo(({
                                  v,
                                  principal,
                                  k,
                                  handleEvents
                                }: { v: BoxAllInfo, principal?: Principal, k: number, handleEvents: Function }) => {
  return <Styled.MoreButton style={{display: String(v.owner) === String(principal) ? "flex" : "none"}}
                            onClick={handleEvents(k)}>
    <div>
      <Icon name={"more"} width={0.5} height={2.9}/>
    </div>
  </Styled.MoreButton>

});
