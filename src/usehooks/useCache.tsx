import {CacheApi, PROFILENotFound, PubKeyNotFound, UserIdNotFound} from "@/api/cache";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "./useAuth";
import {MBApi, ProfileApi} from "@/api";
import {useOwnerStore} from "@/redux";

export interface Props {
  domain: string;
  profileID: string;
  publicKey: string
}

export const useCacheProvider = (): Props => {
  const [userId, setUserId] = useState("")
  const [profile, setProfile] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const {principal} = useAuth()
  const {user_principal} = useOwnerStore()


  const fetch = async () => {
    if (!principal) return
    const profile = await getProfile()
    getPubKey(profile)
  }

  const getUserId = async () => {
    if (!user_principal) throw new Error("principal is undefined")
    let userId
    try {
      userId = await CacheApi.get_userid(user_principal)
      if (userId === UserIdNotFound) userId = await MBApi.getNameFromPrincipal(user_principal)
    } catch (e) {
      userId = await MBApi.getNameFromPrincipal(user_principal)
    } finally {
      setUserId(!!userId ? userId : UserIdNotFound)
    }
  }

  const getProfile = async (): Promise<string> => {
    if (!principal) throw new Error("principal is undefined")
    let profile
    try {
      profile = await CacheApi.get_profile(principal)
      if (profile === PROFILENotFound) profile = String(await MBApi.getProfile(principal))
    } catch (e) {
      profile = String(await MBApi.getProfile(principal))
    } finally {
      setProfile(profile !== "undefined" ? profile : PROFILENotFound)
    }
    return profile
  }

  const getPubKey = async (profile: string) => {
    if (!principal) throw new Error("principal is undefined")
    if (profile === "undefined") throw new Error("profile is undefined")
    let pubKey
    const profileApi = ProfileApi(profile)
    try {
      pubKey = await CacheApi.get_pubkey(principal)
      if (pubKey === PubKeyNotFound) pubKey = await profileApi.getPublicKey()
    } catch (e) {
      pubKey = await profileApi.getPublicKey()
    } finally {
      setPublicKey(!!pubKey ? pubKey : PubKeyNotFound)
    }
  }

  useEffect(() => {
    user_principal && getUserId()
  }, [user_principal])

  useEffect(() => {
    principal && !principal.isAnonymous() && fetch()
  }, [principal])

  return {
    domain: userId,
    profileID: profile,
    publicKey: publicKey
  }
};

const props: Props = {
  domain: "",
  profileID: "",
  publicKey: ""
}

const cacheContext = createContext(props);

export function ServerCache({children}) {
  const cache = useCacheProvider();

  return (
    <cacheContext.Provider value={Object.assign(cache)}>
      {children}
    </cacheContext.Provider>
  );
}

export const useCache = () => {
  return useContext(cacheContext);
};
