import {createSlice} from "@reduxjs/toolkit";
import {useAppSelector} from "@/redux";
import type {RootState} from "@/redux/store";
import {User} from "@/api";

interface Props {
  following?: User[]
  followers?: User[]
}

const initialState: Props = {
  followers: undefined,
  following: undefined
}
export const followingSlice = createSlice({
  name: "following",
  initialState,
  reducers: {
    update: (state, action: { type: string, payload: Props }) => {
      return {...state, ...action.payload};
    },
  },
});

const {update} = followingSlice.actions;
const following = (state: RootState) => state.following;
export const updateFollowing = async (result: Props) => {
  const store = await (await import("@/redux/store")).default;
  store.dispatch(update(result));
};
export const useFollowingStore = (): Props => useAppSelector(following);
export default followingSlice.reducer;
