import {GetAgent} from "@/did/Agent";
import {idlFactory as OGIDL} from "@/did/OG.did";
import {Principal} from "@dfinity/principal";
import {Result} from "@/did/model/OG";
import {error_text, getUint8ArrayFromHex, normal_judge} from "@/utils/common";
import {updateProfileStore} from "@/redux";


const OG_Cid = "wpek7-eaaaa-aaaal-qbjmq-cai"

class OG {
  async getAgent() {
    return await GetAgent.getAgent();
  }

  async getActor() {
    return await GetAgent.createActor(OGIDL, OG_Cid);
  }

  async getOgNum(principal: Principal) {
    try {
      const Actor = await this.getActor()
      const res = Number(await Actor.getOgNum(principal))
      updateProfileStore({OG_number: res})
    } catch (e) {
      throw e
    }
  }

  burn_OG(accountID: string, amount: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const to = getUint8ArrayFromHex(accountID);
        const AccountIdentifier = Array.from(to);
        const Actor = await this.getActor()
        const res = await Actor.burn(AccountIdentifier, BigInt(amount)) as Result
        if (normal_judge(res)) return resolve("ok")//@ts-ignore
        return reject(error_text(res.err))
      } catch (e) {
        reject(e)
      }
    })
  }
}

export const OGApi = new OG()
