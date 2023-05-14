import {createSlice} from "@reduxjs/toolkit"
import {useAppSelector} from "@/redux"
import type {RootState} from "@/redux/store"
import {Principal} from "@dfinity/principal"

interface Props {
  isOwner?: boolean
  user_principal?: Principal
}

const initialState: Props = {
  isOwner: false,
  user_principal: undefined
}
export const ownerStoreSlice = createSlice({
  name: "ownerStore",
  initialState,
  reducers: {
    update: (state, action: { type: string, payload: Props }) => {
      return {...state, ...action.payload}
    },
  },
})

const {update} = ownerStoreSlice.actions
const ownerStore = (state: RootState) => state.ownerStore
export const updateOwnerStore = async (result: Props) => {
  const store = await (await import("@/redux/store")).default
  store.dispatch(update(result))
}
export const useOwnerStore = (): Props => useAppSelector(ownerStore)
export default ownerStoreSlice.reducer
