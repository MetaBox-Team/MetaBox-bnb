import React, {useEffect} from 'react';
import {ListItemStyles as Styled} from "@/views/DataBox_2/components/TableMaintain/styles";
import Checkbox, {CheckboxChangeEvent} from "antd/es/checkbox";
import Icon from "@/icons/Icon";
import {ICON} from "@/utils/T";
import {desensitizationPrincipal} from "@/utils/formate";
import {size_unit} from "@/utils/common";
import {DataBoxStyles as Styles} from "@/views/DataBox_2/styles";
import {useTranslation} from "react-i18next";
import {useAuth} from "@/usehooks/useAuth";
import Tooltip from "antd/es/tooltip";
import {Tag} from "@/styles";
import {FileExt} from "@/did/model/DataBox";

interface Props {
  plainOptions: any
  handleEvents: Function
  checkedList: number[],
  indeterminate: boolean
  checkAll: boolean
  onChange: Function
  onCheckAllChange: (e: CheckboxChangeEvent) => void
  nfts: FileExt[]
}

export const TableContent = React.memo((props: Props) => {
  const {plainOptions} = props
  return <>
    <Title {...props}/>
    <Styled.TableMaintain>
      {plainOptions.map((v, k) => {
        return <Item key={k} k={k} v={v} {...props}/>
      })}
    </Styled.TableMaintain>
  </>
})

const Title = React.memo((props: { indeterminate: boolean, onCheckAllChange: (e: CheckboxChangeEvent) => void, checkAll: boolean, plainOptions: any }) => {
  const {t} = useTranslation()
  const Translate = React.useCallback((anchor: string) => t(`DataBox.${anchor}`), [t])

  return <Styles.TableTittle>
    <TitleName {...props} Translate={Translate}/>
    <TitleSize {...props} Translate={Translate}/>
    <div>{Translate("file_location")}</div>
    <div>{Translate("file_key")}</div>
  </Styles.TableTittle>
})

const TitleSize = React.memo((props: { Translate: Function, plainOptions: any }) => {
  const {Translate, plainOptions} = props
  return <div
    style={{display: !Object.keys(plainOptions[0]).includes("total_size") ? "none" : "flex"}}>&nbsp;
    {Translate("file_size")}
  </div>
})

const TitleName = React.memo((props: { indeterminate: boolean, onCheckAllChange: (e: CheckboxChangeEvent) => void, checkAll: boolean, Translate: Function }) => {
  const {indeterminate, onCheckAllChange, checkAll, Translate} = props
  return <div>
    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}/>
    &nbsp;&nbsp;{Translate("file_name")}
  </div>
})


const Item = React.memo((props: { k: number, handleEvents: Function, checkedList: number[], onChange: Function, v, nfts: FileExt[] }) => {
  const {
    k,
    handleEvents,
    checkedList,
    v
  } = props
  return <Styled.TableItem onContextMenu={handleEvents(k)} isClick={checkedList.includes(k)}>
    <ItemName {...props}/>
    <ItemSize v={v}/>
    <div>&nbsp;{Object.keys(v.page_field)[0]}</div>
    <div>{v.file_key}</div>
  </Styled.TableItem>
})
//
const ItemName = React.memo((props: { k: number, checkedList: number[], onChange: Function, v, nfts: FileExt[] }) => {
  const {principal} = useAuth()
  const {k, onChange, checkedList, v} = props
  const is_owner = React.useMemo(() => {
    if (principal && v.owner) return principal.toString() === v.owner.toString();
    return false
  }, [principal, v])

  const isNft = React.useMemo(() => {
    const a = props.nfts.find(e => {
      if ("PlainFileExt" in e) {
        return e.PlainFileExt.file_key === v.file_key
      }
      return false
    })
    return !!a;
  }, [v, props.nfts])

  const isLock = React.useMemo(() => {
    const keys = Object.keys(v)
    if (keys.includes("isPublic")) {
      return !v.isPublic
    } else {
      return v.is_private
    }
  }, [v])

  return <div style={{display: "flex", alignItems: "center"}}>
    <Checkbox onChange={onChange(k)} checked={checkedList.includes(k)}/>
    &nbsp;<Icon name={ICON(v.file_extension)}/>
    &nbsp;&nbsp;
    {v.file_name.length > 20 ? desensitizationPrincipal(v.file_name, 8) : v.file_name}
    &nbsp;&nbsp;
    <Tag style={{position: "relative"}} isOwner={is_owner}>
      {is_owner ? "Own" : "Other's"}
    </Tag>
    <div style={{width: "1rem"}}/>
    {isLock &&
      <Tooltip title={"private"}>
        <div style={{cursor: "default"}}><Icon name={"lock"}/></div>
      </Tooltip>}
    {isNft &&
      <Tag style={{position: "relative", background: "rgba(159,201,244,0.75)", color: "#1d80e1"}} isOwner={is_owner}>
        NFT
      </Tag>
    }
  </div>
})

const ItemSize = React.memo((props: { v }) => {
  const {v} = props
  return <div style={{display: v.total_size ? "flex" : "none"}}>
    {size_unit(Number(v.total_size))}
  </div>
})

