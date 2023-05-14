import React, {useState} from 'react';
import {HandleBoxActionStyles as Styled} from "./styles";
import {
  TransferModal,
  TopUpModal,
  NormalDialogModal,
  UpdateBoxInfoModal, ShareBoxModal
} from "@/components";
import {BoxAllInfo, BoxInfo__1} from '@/did/model/MBox';
import {DataBoxApi, MBApi} from "@/api";
import {useOwnerStore} from "@/redux";
import {toast_api} from "@/utils/T";
import {useTranslation} from "react-i18next";
import {DeleteBoxModal} from "@/components/Modals/SelectBoxModal/DeleteBoxModal";
import {MintApi} from "@/api/Mint";

export const HandleBoxAction = React.memo(({top, left, show, setShow, boxItem, ref_1}: {
  top: number, left: number, show: boolean, setShow: Function, boxItem?: BoxAllInfo, ref_1: React.MutableRefObject<HTMLDivElement | null>
}) => {
  const [openShare, setOpenShare] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openTransfer, setOpenTransfer] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openTopUp, setOpenTopUp] = useState(false)
  const [openStop, setOpenStop] = useState(false)
  const [openMint, setOpenMint] = useState(false)

  const {user_principal} = useOwnerStore()

  const isRunning = React.useMemo(() => {
    if (boxItem) return Object.keys(boxItem.status)[0] === "running"
    else return false
  }, [boxItem])

  const handleShare = () => setOpenShare(true)

  const handleDelete = () => setOpenDelete(true)

  const handleTransfer = () => setOpenTransfer(true)

  const handleUpdate = () => setOpenUpdate(true)

  const handleTopUp = () => setOpenTopUp(true)

  const handleMint = () => setOpenMint(true)

  const Mint = async () => {
    if (boxItem) {
      const boxApi = DataBoxApi(boxItem.canister_id.toString())
      const _mint = () => {
        return new Promise(async (resolve, reject) => {
          try {
            // const log_res = await boxApi.mintNftCollection()
            // if (log_res) return resolve("ok")
            // return reject("log error")

            const mint_res = await MintApi.mintCollection(boxItem)
            if (mint_res) {
              const log_res = await boxApi.mintNftCollection()
              if (log_res) return resolve("ok")
              return reject("log error")
            } else return reject("mint error")
          } catch (e) {
            reject(e)
          }
        })
      }
      toast_api(_mint(), boxItem.box_name, "mint").then(e => {
        MBApi.getBoxes(user_principal)
      })
    }
  }

  const handleChangeStatus = React.useCallback(() => {
    if (boxItem) {
      const arg: BoxInfo__1 = boxItem
      const isRunning = Object.keys(boxItem.status)[0] === "running"
      toast_api(isRunning ? MBApi.stopBox(arg) : MBApi.startBox(arg), boxItem.box_name, isRunning ? "stop" : "start").then(e => {
        MBApi.getBoxes(user_principal)
      })
      setOpenStop(false)
    }
  }, [boxItem, user_principal])

  const handleClick = React.useCallback((index) => {
    return () => {
      setShow(false)
      switch (index) {
        case 2:
          handleShare()
          break;
        case 1:
          handleDelete()
          break;
        case 3:
          handleTransfer()
          break;
        case 4:
          handleUpdate()
          break;
        case 0:
          setOpenStop(true)
          break;
        case 5:
          handleTopUp()
          break;
        case 6:
          handleMint()
          break;
        default:
          return 0
      }
    }
  }, [])

  document.onclick = (e) => {
    setShow(false)
  }

  const ItemArr = React.useMemo(() => {
    const item = ["DataPanel.action_delete", "DataPanel.action_share", "DataPanel.action_transfer", "DataPanel.action_update", "DataPanel.action_topUp"]
    if (boxItem) {
      return Object.keys(boxItem.status)[0] === "running" ? ["DataPanel.action_stop", ...item, "Mint"] : ["DataPanel.action_start", "DataPanel.action_delete"]
    }
    return []
  }, [boxItem])


  return (
    <Styled.MainContainer isShow={show} ref={ref_1} style={{top: `${top}px`, left: `${left}px`}}>
      <UpdateBoxInfoModal open={openUpdate} setOpen={setOpenUpdate} boxItem={boxItem}/>
      <TopUpModal open={openTopUp} setOpen={setOpenTopUp} boxItem={boxItem}/>
      <ShareBoxModal boxItem={boxItem} open={openShare} setOpen={setOpenShare}/>
      <DeleteBoxModal open={openDelete} setOpen={setOpenDelete} boxItem={boxItem}/>
      <TransferModal setOpen={setOpenTransfer} open={openTransfer} boxItem={boxItem}/>
      <NormalDialogModal onOK={handleChangeStatus} setOpen={setOpenStop} open={openStop}
                         title={`${isRunning ? "Stop" : "Start"} Box`}
                         description={`Are you sure you want to ${isRunning ? "stop" : "start"} this box`}
                         isLink={false}/>
      <NormalDialogModal onOK={Mint} setOpen={setOpenMint} open={openMint}
                         title={`Create a collection`}
                         description={`Are you sure you want to make this box mint into a collection?`}
                         isLink={false}/>
      <Items ItemArr={ItemArr} handleClick={handleClick}/>
    </Styled.MainContainer>
  )
})

const Items = React.memo(({ItemArr, handleClick}: { ItemArr: string[], handleClick: Function }) => {
  const {t} = useTranslation()
  return <>
    {ItemArr.map((v, k) =>
      <Styled.Item onClick={handleClick(k)} key={k}>
        {t(v)}
      </Styled.Item>)}
  </>
})

