import {createSlice} from "@reduxjs/toolkit"
import {useAppSelector} from "@/redux"
import type {RootState} from "@/redux/store"

interface Interface {
  passwordHash: string
  privateKey: string
  publicKey: string
}

type optionInterface = Partial<Interface>

const initialState: Interface = {
  passwordHash: "",
  privateKey: "",
  publicKey: ""
}
export const keyStoreSlice = createSlice({
  name: "keyStore",
  initialState,
  reducers: {
    update: (state, action: { type: string, payload: optionInterface }) => {
      return {...state, ...action.payload}
    },
  },
})

const {update} = keyStoreSlice.actions
const keyStore = (state: RootState) => state.keyStore
export const updateKeyStore = async (result: optionInterface) => {
  const store = await (await import("@/redux/store")).default
  store.dispatch(update(result))
}
export const useKeyStore = (): Interface => useAppSelector(keyStore)
export default keyStoreSlice.reducer
