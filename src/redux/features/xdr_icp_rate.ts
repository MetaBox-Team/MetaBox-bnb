import {createSlice} from "@reduxjs/toolkit"
import {getState, useAppSelector} from "@/redux"
import type {RootState} from "@/redux/store"

const initialState: number = 0
export const rateSlice = createSlice({
    name: "rate",
    initialState,
    reducers: {
        update: (state, action: any) => {
            return action.payload
        },
    },
})

const {update} = rateSlice.actions
const rate = (state: RootState) => state.rate
export const updateRate = async (result: any) => {
    const store = await (await import("@/redux/store")).default
    store.dispatch(update(result))
}
export const useRateStore = (): any => useAppSelector(rate)
export const getRate = (): any => getState()["rate"]
export default rateSlice.reducer
