import {createSlice} from "@reduxjs/toolkit";
import {useAppSelector, getState} from "@/redux";
import type {RootState} from "@/redux/store";
import {Link} from "@/did/model/Profile";


const initialState: Link[] = []
export const linksSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    update: (state, action: { type: string; payload: Link[] }) => {
      return action.payload;
    },
  },
});

const {update} = linksSlice.actions;
const links = (state: RootState) => state.links;
export const updateLinks = async (result: Link[]) => {
  const store = await (await import("@/redux/store")).default;
  store.dispatch(update(result));
};
export const useLinksStore = (): Link[] => useAppSelector(links);
export default linksSlice.reducer;
