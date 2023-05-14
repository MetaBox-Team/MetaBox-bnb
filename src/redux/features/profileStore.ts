import {createSlice} from "@reduxjs/toolkit";
import {useAppSelector} from "@/redux";
import type {RootState} from "@/redux/store";
import {ActivityResponse} from "@/api";

interface Props {
  name?: string
  description?: string
  pre_private_key?: string
  avatar_url?: string
  OG_number?: number
  active_info?: ActivityResponse
}

const initialState: Props = {
  name: undefined,
  description: undefined,
  pre_private_key: "",
  avatar_url: "",
  OG_number: 0,
  active_info: undefined
}
export const profileStoreSlice = createSlice({
  name: "profileStore",
  initialState,
  reducers: {
    update: (state, action: { type: string; payload: Props }) => {
      return {...state, ...action.payload};
    },
  },
});

const {update} = profileStoreSlice.actions;
const profileStore = (state: RootState) => state.profileStore;
export const updateProfileStore = async (result: Props) => {
  const store = await (await import("@/redux/store")).default;
  store.dispatch(update(result));
};
export const useProfileStore = (): Props => useAppSelector(profileStore);
export default profileStoreSlice.reducer;
