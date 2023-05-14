import {createSlice} from "@reduxjs/toolkit"
import {useAppSelector} from "@/redux"
import type {RootState} from "@/redux/store"
import {Principal} from "@dfinity/principal"
import {AssetExt, FieldLocation, FileExt} from "@/did/model/DataBox";

export interface sharedType {
  description: string
  file_extension: string
  file_key: string
  file_name: string
  isPublic: boolean
  other: Principal
  receiver: Principal,
  create_time: bigint,
  page_field: FieldLocation,
}

interface Interface {
  canisterID: string
  encryptFiles?: Array<AssetExt>
  plainFiles?: Array<AssetExt>
  myShare?: Array<AssetExt>
  sharedWithMe?: Array<sharedType>
  nfts?: FileExt[]
}

const initialState: Interface[] = []

export const dataBoxFilesSlice = createSlice({
  name: "allFiles",
  initialState,
  reducers: {
    update: (state, action: { type: string, payload: Interface }) => {
      const cid = action.payload.canisterID
      const index = state.findIndex(e => e.canisterID === cid)
      if (index === -1) return [...state, action.payload]
      const new_state = [...state]
      new_state[index] = {...new_state[index], ...action.payload}
      return new_state
    },
  },
})

const {update} = dataBoxFilesSlice.actions
const dataBoxFiles = (state: RootState) => state.dataBoxFiles
export const updateAllFiles = async (result: Interface) => {
  const store = await (await import("@/redux/store")).default
  store.dispatch(update(result))
}

export const clean = (canisterID: string) => {
  setTimeout(() => {
    updateAllFiles({
      canisterID,
      encryptFiles: undefined,
      plainFiles: undefined,
      sharedWithMe: undefined,
      myShare: undefined
    }).then()
  }, 100)
}
export const useAllFileStore = (): Interface[] => useAppSelector(dataBoxFiles)
export default dataBoxFilesSlice.reducer
