import React, {useEffect, useState} from 'react';
import "./index.css";
import {MBApi} from "@/api";
import {Principal} from "@dfinity/principal";
import {useAuth} from "@/usehooks/useAuth";
import {toast_api} from "@/utils/T";
import {BoxInfo__1} from "@/did/model/MBox";
import {View} from "@/components/Modals/SelectBoxModal/View";

export const DeleteBoxModal = React.memo(({open, setOpen, boxItem}: {
  open: boolean, setOpen: Function, boxItem?: BoxInfo__1
}) => {
  const [whichBox, setWhichBox] = useState("")
  const {principal} = useAuth()

  useEffect(() => {
    open && setWhichBox("")
  }, [open])

  const handleConfirm = React.useCallback(() => {
    try {
      const to = Principal.from(whichBox)
      if (boxItem) toast_api(MBApi.deleteBox(
        {
          'cycleTo': [to],
          'box_type': boxItem.box_type,
          'canisterId': boxItem.canister_id,
        }
      ), boxItem.box_name, "delete").then(() => MBApi.getBoxes(principal))
      setOpen(false)
    } catch (e) {
    }
  }, [whichBox, boxItem, principal])

  const cancel = React.useCallback(() => setOpen(false), [])

  const props = React.useMemo(() => {
    return {open, handleConfirm, handleCancel: cancel, whichBox, setWhichBox}
  }, [open, handleConfirm, cancel, whichBox, setWhichBox])
  return (
    <View {...props} boxItem={boxItem}/>
  );
})
