import {createSlice} from "@reduxjs/toolkit"
import { useAppSelector} from "@/redux"
import type {RootState} from "@/redux/store"

const initialState: number = -1
export const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    update: (state, action: { type: string, payload: number }) => {
      return action.payload
    },
  },
})

const {update} = balanceSlice.actions
const balance = (state: RootState) => state.balance
export const updateBalance = async (result: any) => {
  const store = await (await import("@/redux/store")).default
  store.dispatch(update(result))
}
export const useBalanceStore = (): number => useAppSelector(balance)
export default balanceSlice.reducer
