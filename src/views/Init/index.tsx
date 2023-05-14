import React, {useEffect} from 'react';
import {MBApi, Profile, ProfileApi} from "@/api";
import {RSAEncryptApi, EncryptApi} from "js-databox"
import {sha256} from "js-sha256";
import random from "string-random";
import {useBoxesStore} from "@/redux";
import {timer} from "@/utils/common";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

export const Init = React.memo(({
                                  name,
                                  password,
                                  userId,
                                }: { name: string, password: string, userId: string }) => {
  const {profile} = useBoxesStore()
  const {t} = useTranslation()

  const gen_key = React.useCallback(async () => {
    const keyPair = await RSAEncryptApi.generateKey()
    const public_key = await RSAEncryptApi.publicExportCryptoKey(keyPair.publicKey)
    const private_key = await RSAEncryptApi.exportCryptoKey(keyPair.privateKey)
    const password_hash = sha256(password)
    const aes_iv = random(128)
    const encrypted_private_key = await EncryptApi.encryptPrivateKey(private_key, password_hash, aes_iv)
    return {public_key, encrypted_private_key, aes_iv}
  }, [password])

  const set_info = async (api: Profile) => {
    api.setProfile({
      name: [name],
      description: [],
      avatar_url: []
    }).then()
  }

  const init = async () => {
    try {
      const profile_1 = profile ? profile : String(await MBApi.createProfile())
      console.log(profile_1)
      const profileApi = ProfileApi(profile_1)
      const {public_key, encrypted_private_key, aes_iv} = await gen_key()
      set_info(profileApi).then()
      const promise_arr: Promise<string>[] = [profileApi.set_public_key(public_key), profileApi.set_private_key(
        JSON.stringify({
          encrypted_private_key,
          aes_iv
        })
      ), MBApi.setName(userId)]
      const res = await Promise.all(promise_arr)
      if (res.every(e => !!e)) {
        toast.success("success") && location.replace("/")
      } else timer(t("toast.init_failed"))
    } catch (e) {
      console.error(e)
      // timer("something wrong happened")
    }
  }

  useEffect(() => {
    init()
  }, [profile])

  return <Loading/>
})

const Loading = React.memo(() => {
  return <div>
    <div style={{
      width: "500px",
      height: "500px",
      background: `url(https://media.tenor.com/FawYo00tBekAAAAC/loading-thinking.gif)`,
      backgroundSize: "cover"
    }}/>
    initializing......
  </div>
})

