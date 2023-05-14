import React, {createContext, useContext, useEffect, useState} from "react";
import {authClient, IIForIdentity} from "@/did/Agent/IIForIdentity";
import plugWallet from "@/did/Agent/plugWallet";
import {get_eth_address, getToAccountIdentifier, SeedToPrincipal} from "@/utils/common";
import {CommonStore} from "@/store/common.store";
import Storage from "../utils/storage";
import {MBApi, MetBoxCid} from "@/api";
import {Principal} from "@dfinity/principal";
import {useOwnerStore} from "@/redux";
import {DelegationIdentity} from "@dfinity/identity";
import {Wallet} from "../../agent-js-0.13.1/packages/auth-client/src";
import {sha256} from "js-sha256";
import {fromHexString} from "../../agent-js-0.13.1/packages/identity/src/buffer";

export type WalletType = "II" | "plugWallet";
export const II = "II";
export const plug = "plugWallet";

export interface Props {
  readonly identity: DelegationIdentity | undefined;
  readonly isAuthClientReady: boolean;
  readonly principal: Principal | undefined;
  readonly logOut: Function | undefined;
  readonly logIn: Function | undefined;
  readonly isAuth: boolean;
  readonly plugLogIn: Function | undefined;
  readonly subAccountId: string | undefined;
}

export const useProvideAuth = (authClient: IIForIdentity): Props => {
  const [_identity, _setIdentity] = useState<DelegationIdentity | undefined>(undefined);
  const [isAuthClientReady, setAuthClientReady] = useState(false);
  const [principal, setPrincipal] = useState<Principal | undefined>(undefined);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [subAccountId, setSubAccountId] = useState<string>("");

  if (!isAuthClientReady) authClient.create().then(() => setAuthClientReady(true));

  const init = async () => {
    const type = Storage.getWalletTypeStorage();
    if (type === II) {
      const isMetaMask = localStorage.getItem("isMetaMask")
      const [identity, isAuthenticated] = await Promise.all([
        authClient.getIdentity(),
        authClient.isAuthenticated(),
      ])

      const principal = identity?.getPrincipal() as Principal | undefined;
      if (!!isMetaMask) {
        const address = await get_eth_address()
        const hase_seed = sha256.array((fromHexString(address.slice(2))))
        const pre_principal = SeedToPrincipal(hase_seed)
        if (String(principal) !== String(pre_principal)) await logOut()
      }
      const subAccountId = getToAccountIdentifier(Principal.from(MetBoxCid), principal)
      setSubAccountId(subAccountId)
      setPrincipal(principal);
      _setIdentity(identity as DelegationIdentity | undefined);
      if (isAuthenticated) {
        setAuthenticated(true);
      }
      setAuthClientReady(true);
    } else {
      // try {
      //   if (!window.ic.plug.agent) await PlugWallet.connect();
      //   const principal = await window.ic.plug.agent.getPrincipal()
      //   console.log(String(principal))
      //   const subAccountId = getToAccountIdentifier(Principal.from(MetBoxCid), principal)
      //   setSubAccountId(subAccountId)
      //   setPrincipal(principal);
      //   console.log(subAccountId)
      //   setAuthenticated(true);
      // } catch (e) {
      //   console.log(e)
      //   setAuthenticated(false);
      // }
    }
  }

  useEffect(() => {
    isAuthClientReady && init().then()
  }, [isAuthClientReady]);

  //update principal
  useEffect(() => {
    authClient.setOwnerPrincipal(principal);
  }, [principal]);

  const checkPlug = async () => {
    const connected = await window.ic.plug.isConnected();
    if (connected && !window.ic.plug.agent) {
      await plugLogIn();
    }
  };
  const logIn = async (walletType: Wallet): Promise<{ message?: string; status?: number } | undefined> => {
    if (!authClient) return {message: "connect error"};
    if (walletType === "MetaMask") {
      const address = await get_eth_address()
      const hase_seed = sha256.array((fromHexString(address.slice(2))))
      const principal = SeedToPrincipal(hase_seed)
      setPrincipal(principal)
    }
    const identity = await authClient.login(walletType) as DelegationIdentity
    if (identity) {
      const principal = identity.getPrincipal();
      const subAccountId = getToAccountIdentifier(Principal.from(MetBoxCid), principal)
      setPrincipal(principal);
      setSubAccountId(subAccountId);
      _setIdentity(identity);
      setAuthenticated(true);
      Storage.setWalletTypeStorage("II");
      if (walletType === "MetaMask") localStorage.setItem("isMetaMask", "1")
      else localStorage.removeItem("isMetaMask")
    } else {
      return {message: "connect error"};
    }
  };
  //aGVsbG8=
  const plugLogIn = async (): Promise<{ message?: string; status?: number } | undefined> => {
    Storage.setWalletTypeStorage("plugWallet");
    const result = await plugWallet.connect();
    if (result) {
      const principal = await window?.ic?.plug?.agent?.getPrincipal();
      const subAccountId = getToAccountIdentifier(Principal.from(MetBoxCid), principal)
      setPrincipal(principal);
      setSubAccountId(subAccountId);
      setAuthenticated(true);
      return {status: 200};
    } else {
      return {message: "connect error"};
    }
  };

  const logOut = async (): Promise<void> => {
    await authClient.logout();
    setAuthenticated(false);
  };

  const Context: Props = {
    identity: _identity,
    isAuthClientReady,
    principal,
    logIn,
    logOut,
    isAuth: authenticated,
    plugLogIn,
    subAccountId
  };
  //save common data
  CommonStore.actionSave({...Context});
  return Context;
};

const props: Props = {
  identity: undefined,
  isAuthClientReady: false,
  principal: undefined,
  logIn: undefined,
  logOut: undefined,
  isAuth: false,
  plugLogIn: undefined,
  subAccountId: undefined,
}
const authContext = createContext(props);

export function ProvideAuth({children}) {
  const auth = useProvideAuth(authClient);
  return (
    <authContext.Provider value={Object.assign(auth)}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(authContext);
};
