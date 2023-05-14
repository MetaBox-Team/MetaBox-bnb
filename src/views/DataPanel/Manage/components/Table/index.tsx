import React, {useCallback, useRef, useState} from "react";
import {TableStyles as Styled} from "./styles";
import {useBoxesStore} from "@/redux";
import {Scrollbar} from "@/styles";
import {DataBoxApi, MBApi} from "@/api";
import {HandleBoxAction} from "@/views/DataPanel/Manage/components/HandleBoxAction";
import {useAuth} from "@/usehooks/useAuth";
import {PermissionManagementModal, NormalDialogModal} from "@/components";
import {toast_api} from "@/utils/T";
import {useTranslation} from "react-i18next";
import {Item} from "@/views/DataPanel/Manage/components/Table/Item";


export function Table() {
  const {boxes} = useBoxesStore()
  const [show, setShow] = useState(false)
  const [left, setLeft] = useState<number>(0)
  const [top, setTop] = useState<number>(0)
  const [clickOne, setClickOne] = useState(-1)
  const [openUpgrade, setOpenUpgrade] = useState(false)
  const [openManage, setOpenManage] = useState(false)
  const {principal} = useAuth()
  const ref_1 = useRef<HTMLDivElement>(null)

  const handleEvents = React.useCallback((index) => {
    return (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (ref_1.current) {
        const height = ref_1.current.clientHeight
        const top = e.clientY + height > window.innerHeight ? e.clientY - height : e.clientY
        const left = e.clientX
        setClickOne(index)
        setTop(top)
        setLeft(left)
        setShow(true)
      }
    }
  }, [ref_1])

  const handleManage = React.useCallback((index: number) => {
    return async (e) => {
      e.stopPropagation();
      setOpenManage(true)
      setClickOne(index)
    }
  }, [])

  const handleUpgrade = (index) => {
    return useCallback(() => {
      if (boxes) {
        setOpenUpgrade(false)
        const v = boxes[index]
        toast_api(MBApi.upgradeBox(v), v.box_name, "upgrade").then(() => {
          MBApi.getBoxes(principal)
          const databoxApi = DataBoxApi(v.canister_id.toString())
          databoxApi.memAlign()
        })
      }
    }, [index, boxes, principal])
  }

  return (
    <Styled.Table>
      <HandleBoxAction ref_1={ref_1} boxItem={boxes?.[clickOne]} top={top} left={left} setShow={setShow} show={show}/>
      <PermissionManagementModal boxItem={boxes?.[clickOne]} open={openManage} setOpen={setOpenManage}/>
      <NormalDialogModal onOK={handleUpgrade(clickOne)} isLink={false} title={"Upgrade"}
                         description={"This update is:Fixed a bug that failed to upload files in version 13"}
                         open={openUpgrade}
                         setOpen={setOpenUpgrade}/>
      <TableHead/>
      {boxes && boxes.length > 0 ?
        <Scrollbar>
          {boxes?.map((v, k) => {
            return <Item key={k} v={v} k={k} setOpenUpgrade={setOpenUpgrade}
                         handleManage={handleManage} setClickOne={setClickOne} handleEvents={handleEvents}/>
          })}
        </Scrollbar> :
        <Styled.NonTableHeadItemWrapper>
          <Styled.NonTableItem/>
        </Styled.NonTableHeadItemWrapper>
      }
    </Styled.Table>
  );
}


const TableHead = React.memo(() => {
  const {t} = useTranslation()

  return <Styled.TableHead>
    <Styled.TableHeadItem>{t('DataPanel.box_name')}</Styled.TableHeadItem>
    <Styled.TableHeadItem>{t('DataPanel.box_cycles')}</Styled.TableHeadItem>
    <Styled.TableHeadItem>{t('DataPanel.box_state')}</Styled.TableHeadItem>
    <Styled.TableHeadItem>{t('DataPanel.box_capacity')}</Styled.TableHeadItem>
    <Styled.TableHeadItem>&nbsp;&nbsp;&nbsp;{t('DataPanel.box_version')}</Styled.TableHeadItem>
  </Styled.TableHead>
})
