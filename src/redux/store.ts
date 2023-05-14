import {configureStore} from "@reduxjs/toolkit";
import boxes from "./features/boxes";
import boxesState from "./features/boxesState";
import balance from "@/redux/features/balance"
import rate from "@/redux/features/xdr_icp_rate";
import links from "./features/links";
import following from "@/redux/features/following";
import dataBoxFiles from "@/redux/features/databoxFiles";
import keyStore from "./features/keyStore"
import ownerStore from "./features/ownerStore"
import profileStore from "./features/profileStore";
import email from "./features/email"

const store = configureStore({
  reducer: {
    boxes: boxes,
    boxesState: boxesState,
    balance: balance,
    rate: rate,
    links: links,
    following: following,
    dataBoxFiles: dataBoxFiles,
    keyStore: keyStore,
    ownerStore: ownerStore,
    profileStore: profileStore,
    email: email
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store | any>;
export type AppDispatch = typeof store.dispatch;
//@ts-ignore
export const getState = store.getState;
export default store
