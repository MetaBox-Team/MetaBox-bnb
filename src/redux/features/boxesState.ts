import {createSlice} from "@reduxjs/toolkit";
import {useAppSelector} from "@/redux";
import type {RootState} from "@/redux/store";
import {State} from "@/did/model/DataBox";

const initialState: Array<{ ok: State }> = [];
export const boxesStateSlice = createSlice({
  name: "boxesState",
  initialState,
  reducers: {
    update: (state, action: { type: string; payload: Array<any> }) => {
      return action.payload;
    },
  },
});

const {update} = boxesStateSlice.actions;
const userState = (state: RootState) => state.boxesState;
export const updateBoxesState = async (result: { ok: State }[]) => {
  const store = await (await import("@/redux/store")).default;
  store.dispatch(update(result));
};
export const useBoxesStateStore = (): { ok: State }[] => useAppSelector(userState);
export default boxesStateSlice.reducer;
