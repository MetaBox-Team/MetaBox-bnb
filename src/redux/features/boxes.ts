import {createSlice} from "@reduxjs/toolkit";
import {getState, useAppSelector} from "@/redux";
import type {RootState} from "@/redux/store";
import {BoxAllInfo} from "@/did/model/MBox";

interface Interface {
  boxes?: Array<BoxAllInfo>;
  profile?: string
  cycles?: number;
  memory?: number;
  allVersion?: Array<number>
  shareBoxes?: BoxAllInfo[]
  sharedBoxes?: BoxAllInfo[]
  data_box_new_version?: number
  box_avatars?: string[]
  isFirstDataBox?: boolean,
  need_icp?: number,
  isMint?: boolean[]
}

const initialState: Interface = {
  box_avatars: [],
  boxes: undefined,
  profile: undefined,
  cycles: undefined,
  memory: undefined,
  allVersion: undefined,
  shareBoxes: undefined,
  sharedBoxes: undefined,
  data_box_new_version: undefined,
  isFirstDataBox: undefined,
  need_icp: undefined,
  isMint: undefined
};
export const boxesSlice = createSlice({
  name: "boxes",
  initialState,
  reducers: {
    update: (state, action: { type: string; payload: Interface }) => {
      return Object.assign({}, {...state, ...action.payload});
    },
  },
});

const {update} = boxesSlice.actions;
const userState = (state: RootState) => state.boxes;
export const updateBoxes = async (result: Interface) => {
  const store = await (await import("@/redux/store")).default;
  store.dispatch(update(result));
};
export const useBoxesStore = (): Interface => useAppSelector(userState);
export const getBoxes = (): any => getState()["boxes"];
export default boxesSlice.reducer;
