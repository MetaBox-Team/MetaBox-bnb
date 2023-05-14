import React, {useCallback, useMemo} from 'react'
import "./index.css"
import {Principal} from "@dfinity/principal"
import {MBApi} from "@/api"
import {BoxAllInfo} from "@/did/model/MBox"
import {useAuth} from "@/usehooks/useAuth"
import {Profile__1} from "@/did/model/Profile"
import {toast_api} from "@/utils/T"
import {OtherItemView} from "@/components/Modals/components"

export const NotOwnerItem = React.memo(({
                                          boxItem,
                                          setOpen,
                                          owner,
                                          info
                                        }: { boxItem?: BoxAllInfo, setOpen: Function, owner?: Principal, info?: Profile__1 }) => {
  const {principal} = useAuth()

  const goto = useCallback(() => {
    const to = String(owner)
    window.open(`/${to}`)
  }, [owner])

  const handleCancel = useCallback((e) => {
    e.stopPropagation()
    boxItem && toast_api(cancel_shared, boxItem.box_name, "Unshared").then(() => MBApi.getBoxes(principal))
    setOpen(false)
  }, [boxItem, principal])

  const cancel_shared = () => {
    return new Promise(async (resolve, reject) => {
      if (boxItem && owner) {
        const removeSharedBoxRes = await MBApi.removeSharedBox(boxItem.canister_id, owner)
        if (Object.keys(removeSharedBoxRes)[0] === "ok") resolve("ok")//@ts-ignore
        else reject(String(Object.keys(removeSharedBoxRes.err)[0]))
      }
    })
  }

  const props = useMemo(() => {
    return {goto, info, handleCancel, isOwner: false}
  }, [goto, info, handleCancel])

  return <OtherItemView {...props}/>
});
