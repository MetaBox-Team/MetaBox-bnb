import {createSlice} from "@reduxjs/toolkit"
import {useAppSelector} from "@/redux"
import type {RootState} from "@/redux/store"
import {RecentDownloadFile, ShareResponse, UnhandledEmail} from "@/api";

interface Props {
  unhandledEmail?: UnhandledEmail[]
  shareResponse?: ShareResponse[]
  recently_download?: RecentDownloadFile[]
}

const initialState: Props = {
  unhandledEmail: [],
  shareResponse: [],
  recently_download: []
}
export const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    update: (state, action: { type: string, payload: Props }) => {
      return {...state, ...action.payload}
    },
  },
})

const {update} = emailSlice.actions
const email = (state: RootState) => state.email
export const updateEmail = async (result: Props) => {
  const store = await (await import("@/redux/store")).default
  store.dispatch(update(result))
}
export const useEmailStore = (): Props => useAppSelector(email)
export default emailSlice.reducer
