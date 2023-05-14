import React, {useEffect, useMemo, useRef, useState} from "react";
import {ListItemStyles as Styled} from "./styles";
import {DataBoxStyles as Styles} from "../../styles"
import {sharedType, useAllFileStore, useBoxesStateStore, useOwnerStore} from "@/redux";
import {useTranslation} from "react-i18next";
import {AllFileFoot} from "@/views/DataBox_2/components/AllFileFoot";
import {AssetExt} from "@/did/model/DataBox";
import {SharedWithMeFoot} from "@/views/DataBox_2/components/SharedWithMeFoot";
import {TableContent} from "@/views/DataBox_2/components/TableMaintain/components";
import {ActionPanel, ShareActionPanel} from "@/views/DataBox_2/components";
import {Skeleton} from "@mui/material";
import {useParams} from "react-router-dom";
import {STORE_ONE_MONTH_COST} from "@/utils/common";

const ShareButton = React.memo(({
                                  dataType,
                                  setIsMyShared,
                                  isMyShared
                                }: { dataType: number, setIsMyShared: Function, isMyShared: boolean }) => {
  const {t} = useTranslation()

  const Translate = (anchor: string) => {
    return t(`DataBox.${anchor}`)
  }
  return <Styled.ShareWrap style={{display: dataType === 3 ? "flex" : "none"}}>
    <Styled.ButtonWrap onClick={() => setIsMyShared(true)}
                       isClick={isMyShared}>{Translate("my_shared")}</Styled.ButtonWrap>
    <Styled.ButtonWrap onClick={() => setIsMyShared(false)}
                       isClick={!isMyShared}>{Translate("shared_with_me")}</Styled.ButtonWrap>
  </Styled.ShareWrap>
})

export const TableMaintain = React.memo(({dataType}: { dataType: number }) => {
  const [left, setLeft] = useState<number>(0)
  const [top, setTop] = useState<number>(0)
  const [isMutiSelect, setIsMutiSelect] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [isShowShareAction, setIsShowShareAction] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false);
  const [clickOne, setClickOne] = useState(-1)
  const [isPoor, setIsPoor] = useState(false)
  const [selectArr, setSelectArr] = useState<any>([])
  const [isMyShared, setIsMyShared] = useState(true)
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const all_box_files = useAllFileStore()
  const {id, canister_id}: { id: string, canister_id: string } = useParams()
  const boxState = useBoxesStateStore()
  const {isOwner} = useOwnerStore()
  const ref_1 = useRef<HTMLDivElement>(null)
  const ref_2 = useRef<HTMLDivElement>(null)


  const {encryptFiles, plainFiles, myShare, sharedWithMe, nfts} = useMemo(() => {
    const cid = canister_id
    const box_item = all_box_files.find(e => e.canisterID === cid)
    if (box_item) return {...box_item}
    else return {encryptFiles: [], plainFiles: [], myShare: [], sharedWithMe: [], nfts: []}
  }, [all_box_files, canister_id])


  const data = React.useMemo(() => {
    switch (dataType) {
      case 0:
        if (encryptFiles && plainFiles)
          return [...encryptFiles, ...plainFiles]
        return []
      case 1:
        return encryptFiles ?? []
      case 2:
        return plainFiles ?? []
      case 3:
        return isMyShared ? myShare ?? [] : []
      default:
        return []
    }
  }, [dataType, encryptFiles, plainFiles, myShare, isMyShared])

  const sharedWithMeFile = useMemo(() => dataType === 3 && !isMyShared ? sharedWithMe ?? [] : [], [dataType, isMyShared, sharedWithMe])
  const plainOptions = useMemo(() => sharedWithMeFile.length > 0 ? sharedWithMeFile : data, [sharedWithMeFile, data])


  const check = () => {
    if (boxState[Number(id)]) {
      const state = boxState[Number(id)].ok
      const balance = Number(state.balance)
      const memory = Number(state.memory_size) + Number(state.stable_memory_size)
      const GbNumber = (memory / (1024 * 1024 * 1024)).toFixed(4);
      const storeCost = Number(GbNumber) * STORE_ONE_MONTH_COST;
      balance <= storeCost * 3 ? setIsPoor(true) : setIsPoor(false)
    }
  }

  useEffect(() => {
    boxState && check()
  }, [boxState])


  useEffect(() => {
    clean()
  }, [dataType, isMyShared])

  useEffect(() => {
    if (checkedList.length > 1) {
      const actionArr: (AssetExt | sharedType)[] = []
      setIsMutiSelect(true)
      checkedList.forEach(e => actionArr.push(plainOptions[e]))
      setSelectArr(actionArr)
    } else setIsMutiSelect(false)
  }, [checkedList])

  const clean = React.useCallback(() => {
    setCheckedList([])
    setIndeterminate(false);
    setCheckAll(false);
    setIsMutiSelect(false)
  }, [])


  const onCheckAllChange = React.useCallback((e) => {
    const newList: number[] = e.target.checked ? [...Array(plainOptions.length).keys()] : []
    setCheckedList(newList)
    setIndeterminate(false);
    setCheckAll(newList.length === plainOptions.length);
  }, [plainOptions])

  const onChange = React.useMemo(() => (index) => {
    return (e) => {
      const newList = JSON.parse(JSON.stringify(checkedList))
      e.target.checked ? newList.push(index) : newList.splice(newList.indexOf(index), 1)
      setCheckedList(newList)
      setIndeterminate(!!newList.length && newList.length < plainOptions.length);
      setCheckAll(newList.length === plainOptions.length);
    }
  }, [checkedList, plainOptions])

  const handleEvents = React.useCallback((index) => {
    return (e) => {
      setClickOne(index)
      e.preventDefault();
      let height: number
      let width: number
      if (ref_1.current && ref_2.current) {
        if (dataType === 3) {
          height = ref_2.current.clientHeight
          width = ref_2.current.clientWidth
        } else {
          height = ref_1.current.clientHeight
          width = ref_1.current.clientWidth
        }
        const top = e.clientY + height > window.innerHeight ? e.clientY - height : e.clientY
        const left = e.clientX + width > window.innerWidth ? e.clientX - width : e.clientX
        setTop(top)
        setLeft(left)
        dataType === 3 ? isOwner && setIsShowShareAction(true) : setIsShow(true)
      }
    }
  }, [dataType, isOwner, ref_1, ref_2])

  document.onclick = (e) => {
    setIsShow(false)
    setIsShowShareAction(false)
  }

  const props = React.useMemo(() => {
    return {clean, isMutiSelect, isMyShared, dataType, selectArr}
  }, [clean, isMutiSelect, isMyShared, dataType, selectArr])

  const share_props = React.useMemo(() => {
    if (isMyShared) return {fileExt: data[clickOne]}
    else return {sharedFile: sharedWithMeFile[clickOne]}
  }, [isMyShared, data, clickOne, sharedWithMeFile])

  const panel_props = React.useMemo(() => {
    return {top, left, isPoor}
  }, [top, left, isPoor])

  return (
    <>
      <ShareButton isMyShared={isMyShared} setIsMyShared={setIsMyShared} dataType={dataType}/>
      <ActionPanel nfts={nfts ? nfts : []} ref_1={ref_1} setShow={setIsShow} fileExt={data[clickOne]} {...panel_props}
                   isShow={isShow}/>
      <ShareActionPanel ref_2={ref_2} setShow={setIsShowShareAction} {...share_props} {...panel_props}
                        isShow={isShowShareAction}/>
      {!encryptFiles ? <Loading/> :
        plainOptions.length === 0 ?
          <Styles.NonTableList>
            <Styles.NonListPic/>
          </Styles.NonTableList> :
          <div style={{position: "relative", display: "flex", flex: '1', flexDirection: "column"}}>
            <TableContent plainOptions={plainOptions}
                          checkedList={checkedList}
                          handleEvents={handleEvents}
                          indeterminate={indeterminate}
                          checkAll={checkAll}
                          onChange={onChange}
                          onCheckAllChange={onCheckAllChange}
                          nfts={nfts ? nfts : []}
            />
            <Foot_1 {...props} {...panel_props}/>
          </div>
      }
    </>
  );
})

const Loading = React.memo(() => {
  const arr = new Array(3).fill(0)
  return <>
    {arr.map((v, k) => {
      return <Skeleton key={k} variant="rectangular" width="100%" height="7.4rem"
                       style={{marginBottom: "1.0rem", borderRadius: "1.2rem"}}/>
    })}
  </>
})

const Foot_1 = React.memo((props: { isPoor: boolean, dataType: number, selectArr: any, isMyShared: boolean, clean: () => void, isMutiSelect: boolean }) => {
  const {dataType, selectArr, isMyShared} = props
  return <>
    {dataType !== 3 ?
      <AllFileFoot {...props} fileArr={selectArr} isMyShared={false}/>
      :
      isMyShared ? <AllFileFoot {...props} fileArr={selectArr} isMyShared={true}/>
        :
        <SharedWithMeFoot {...props} sharedWithMeArr={selectArr}/>
    }
  </>
})

