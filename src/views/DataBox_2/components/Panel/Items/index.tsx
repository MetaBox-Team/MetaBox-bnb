import React from 'react';
import {ActionPanelStyles as Styled} from "@/views/DataBox_2/components/Panel/ShareAction/styles";
import {useTranslation} from "react-i18next";
import Tooltip from "antd/es/tooltip";

export const Items = React.memo(({
                                   ItemArr,
                                   handleClick,
                                   isPoor
                                 }: { ItemArr: string[], handleClick: Function, isPoor: boolean }) => {
  return <>
    {ItemArr.map((v, k) =>
      <Item isPoor={isPoor} k={k} v={v} handleClick={handleClick} key={k}/>
    )}
  </>
})

const Item = React.memo((props: { k: number, v: string, handleClick: Function, isPoor: boolean }) => {
  const {v, k, handleClick, isPoor} = props
  const {t} = useTranslation()
  const Translate = (anchor: string) => t(`DataBox.${anchor}`)

  const isUpdate = React.useMemo(() => k === 2 || k === 3, [k])

  const handleEvent = () => {
    if (isPoor) !isUpdate && handleClick(k)()
    else handleClick(k)()
  }

  return <Tooltip title={isPoor && isUpdate ? "Insufficient cycles" : ""}>
    <Styled.Item style={{cursor: isPoor ? isUpdate ? "no-drop" : "pointer" : "pointer"}} onClick={handleEvent}>
      {v !== "mint" ? Translate(v) : "mint"}
    </Styled.Item>
  </Tooltip>
})

