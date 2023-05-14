import {GetAgent} from "@/did/Agent";
import {idlFactory as MBIDL} from "../did/MBox.did";
import {DataBox, DataBoxApi} from "@/api";
import {
  BoxAllInfo, BoxInfo,
  BoxInfo__1,
  BoxMetadata, CreateBoxArgs,
  DelBoxArgs,
  Result, Result_2, Result_3,
  Result_5, UpgradeBoxArgs,
} from "@/did/model/MBox";
import {updateAllFiles, updateBoxes, updateBoxesState} from "@/redux";
import {Principal} from "@dfinity/principal";
import {MetaBox as MBbox} from "js-metabox"
import {State} from "@/did/model/DataBox";
import {CommonStore} from "@/store/common.store";
import PlugWallet from "@/did/Agent/plugWallet";
import {error_text, getUint8ArrayFromHex, normal_judge} from "@/utils/common";
import {authApi} from "@/api/auth";

type getProfileRes = [] | [Principal]
export const MetBoxCid =
  // "zbzr7-xyaaa-aaaan-qadeq-cai"
//
  "wfqyb-kqaaa-aaaal-qboqa-cai"

class MB {
  async getAgent() {
    return await GetAgent.getAgent();
  }

  async getActor() {
    return await GetAgent.createActor(MBIDL, MetBoxCid);
  }

  async getNoIdentityActor() {
    return await GetAgent.noIdentityActor(MBIDL, MetBoxCid)
  }

  private updateWL(boxes: BoxAllInfo[]) {
    return new Promise(async (resolve, reject) => {
      try {
        const all_id: string[] = []
        for (let i = 0; i < boxes.length; i++) {
          const box = boxes[i];
          const cid = box.canister_id.toString()
          all_id.push(cid)
        }
        await PlugWallet.updateAgentWhitelist(all_id)
        return resolve("")
      } catch (e) {
        return reject(e)
      }
    })
  }

  private init_redux(boxes: BoxAllInfo[]) {
    boxes.forEach(e => {
      updateAllFiles({canisterID: e.canister_id.toString()})
    })
  }

  private static async update_box_avatar(boxes: BoxAllInfo[]) {
    const url_arr: string[] = []
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]
      const url = `https://${box.canister_id.toString()}.raw.ic0.app/avatar/${box.avatar_key}`
      const res = await fetch(url)
      if (res.ok) url_arr.push(url)
      else url_arr.push("")
    }
    updateBoxes({box_avatars: url_arr})
  }

  // principal : anyone principal
  async getBoxes(principal: Principal | undefined): Promise<string[]> {
    try {
      if (principal === undefined) throw new Error("state error")
      const my_principal = CommonStore.common.principal
      const is_self = String(my_principal) === String(principal)
      let actor: DataBox;
      let promises: Array<Promise<{ 'ok': State }>> = [];
      const versionPromises: Array<Promise<number>> = []
      const isMintPromises: Array<Promise<boolean>> = []
      const all_data_boxes: string[] = []
      const Actor = await this.getActor()//@ts-ignore
      const promise_arr: Array<Promise<BoxAllInfo[]>> = is_self ? [Actor.getBoxes(principal), Actor.getSharedBoxes()] : [Actor.getBoxes(principal)]
      const RES = await Promise.all(promise_arr) as BoxAllInfo[][]
      const boxes = is_self ? [...RES[0], ...RES?.[1]] : [...RES[0]]
      this.init_redux(boxes)
      MB.update_box_avatar(boxes).then()
      updateBoxes({boxes: boxes});
      boxes.map(({canister_id, box_type, status}, k) => {
        if (Object.keys(box_type)[0] === "data_box") {
          actor = DataBoxApi(String(canister_id));
          all_data_boxes.push(String(canister_id))
          if (Object.keys(status)[0] === "stopped") {
            promises.push(new Promise((resolve) => resolve({
              ok: {
                balance: BigInt(0),
                memory_size: BigInt(0),
                stable_memory_size: BigInt(0),
              },
            })))
            versionPromises.push(new Promise((resolve) => resolve(0)))
          } else {
            isMintPromises.push(actor.isNftCollection())
            versionPromises.push(actor.getVersion())
            promises.push(actor.canisterState())
          }
        }
      });
      Promise.allSettled(isMintPromises).then(res => {
        const mintArr: boolean[] = []
        for (let i = 0; i < res.length; i++) {
          const item = res[i]
          if (item.status === "fulfilled") mintArr.push(item.value)
          else mintArr.push(false)
        }
        updateBoxes({isMint: mintArr})
      })
      Promise.all(promises).then(result => updateBoxesState(result))
      Promise.all(versionPromises).then(allVersion => updateBoxes({allVersion: allVersion}))
      return all_data_boxes
    } catch (e) {
      throw e
    }
  }

  async getICP() {
    try {
      const Actor = await this.getActor();
      const res = await Actor.getIcp() as bigint
      updateBoxes({need_icp: Number(res)}).then()
      return Number(res)
    } catch (e) {
      throw e
    }
  }

  async isFirstDataBox() {
    try {
      const Actor = await this.getActor()
      const res = await Actor.isNotFirstDataBox() as boolean
      updateBoxes({isFirstDataBox: res})
    } catch (e) {
      throw e
    }
  }

  async createBox(
    arg: BoxMetadata
  ) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const Actor = await this.getActor();
        const Arg: CreateBoxArgs = {
          'metadata': arg
        }
        const res = await Actor.createDataBoxFree(Arg) as Result_5 as any
        if (Object.keys(res)[0] === "ok") {
          await PlugWallet.updateAgentWhitelist([String(res.ok)])
          resolve(String(res.ok))
        } else reject(`${Object.keys(res.err)[0]}:${res.err[Object.keys(res.err)[0]]}`);
      } catch (e) {
        reject(e);
      }
    });
  }

  async createBoxFee(arg: BoxMetadata, is_need_refresh: boolean) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const Actor = await this.getActor();
        const Arg: CreateBoxArgs = {
          'metadata': arg
        }
        const res = await Actor.createDataBoxFee(Arg, is_need_refresh) as Result_5 as any
        if (Object.keys(res)[0] === "ok") {
          await PlugWallet.updateAgentWhitelist([String(res.ok)])
          resolve(String(res.ok))
        } else reject(`${Object.keys(res.err)[0]}:${res.err[Object.keys(res.err)[0]]}`);
      } catch (e) {
        reject(e);
      }
    });
  }


  async transferDataboxOwner(canister_id: Principal, to: Principal): Promise<Result> {
    try {
      const Actor = await this.getActor();
      return await Actor.transferDataboxOwner(canister_id, to) as Result
    } catch (e) {
      throw  e
    }
  }

  async createProfile(): Promise<Principal> {
    try {
      const principal = CommonStore.common.principal
      if (principal) {
        const Actor = await this.getActor();
        const u8 = await authApi.get_auth_token(principal)
        const res = await Actor.createProfile(new Uint8Array(u8)) as Result_3 as any
        if (normal_judge(res)) {
          await PlugWallet.updateAgentWhitelist([String(res.ok)])
          return res.ok as Principal
        } else throw new Error(`${Object.keys(res.err)[0]}`)
      } else throw new Error("principal error")
    } catch (e) {
      throw e
    }
  }

  async topUpCanister(amount: number, canister_id: Principal): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (amount <= 0.02) return reject("amount too small");
      const Actor = await this.getActor();
      const res = await Actor.topUpBox({
        box_id: canister_id,
        icp_amount: amount * 1e8,
      }) as any;
      if (Object.keys(res)[0] === "ok") resolve("ok");
      else reject(`${Object.keys(res.err)[0]}:${res.err[Object.keys(res.err)[0]]}`);
    });
  }

  async startBox(boxInfo: BoxInfo__1): Promise<string> {
    const Actor = await this.getActor();
    return new Promise(async (resolve, reject) => {
      try {
        await Actor.startBox(boxInfo);
        resolve("ok");
      } catch (e) {
        reject(e);
      }
    });
  }

  async stopBox(boxInfo: BoxInfo__1): Promise<string> {
    const Actor = await this.getActor();
    return new Promise(async (resolve, reject) => {
      try {
        await Actor.stopBox(boxInfo);
        resolve("ok");
      } catch (e) {
        reject(e);
      }
    });
  }

  async getBoxState(canister_id: string): Promise<Result_5> {
    try {
      const Actor = await this.getActor();
      return await Actor.getBoxState(Principal.from(canister_id)) as Result_5
    } catch (e) {
      throw e
    }
  }

  async acceptSharedBox(box_id: string, from: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const Actor = await this.getActor();
        const res = await Actor.acceptSharedBox(Principal.from(box_id), Principal.from(from)) as Result
        if (Object.keys(res)[0] === "ok") return resolve("ok")//@ts-ignore
        else return reject(String(Object.keys(res.err)[0]))
      } catch (e) {
        reject(e)
      }
    })
  }

  async upgradeBox(info: BoxInfo): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const Actor = await this.getActor();
        const arg: UpgradeBoxArgs = {
          info: info,
        }
        const res = await Actor.upgradeBox(arg);//@ts-ignore
        if (Object.keys(res)[0] === "ok") resolve("ok");//@ts-ignore
        else reject(`${Object.keys(res.err)[0]}:${res.err[Object.keys(res.err)[0]]}`);
      } catch (e) {
        reject(e);
      }
    });
  }


  async getProfile(principal: Principal): Promise<Principal | undefined> {
    try {
      const Actor = await (await this.getActor());
      const res = await Actor.getProfile(principal) as getProfileRes
      return res[0]
    } catch (e) {
      throw e
    }
  }

  setName(domain: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const Actor = await this.getActor()
        await Actor.setName(domain)
        return resolve("ok")
      } catch (e) {
        return reject(e)
      }
    });
  }

  async getNameFromPrincipal(principal: Principal | undefined): Promise<string> {
    const Actor = await this.getNoIdentityActor() as any
    try {
      const res = await Actor.getNameFromPrincipal(principal)
      if (res[0]) return res[0]
      else return ""
    } catch (e) {
      return ""
    }
  }

  async getPrincipalFromName(name: string): Promise<Principal | undefined> {
    const Actor = await this.getNoIdentityActor() as any
    try {
      const res = await Actor.getPrincipalFromName(name)
      if (res[0]) return res[0]
      else return undefined
    } catch (e) {
      throw e
    }
  }

  async updateBoxInfo(newInfo: BoxInfo__1): Promise<string> {
    const Actor = await this.getActor()
    return new Promise(async (resolve, reject) => {
      try {
        const res = await Actor.updateBoxInfo(newInfo) as any
        if (Object.keys(res)[0] === "ok") resolve("ok")
        else reject(Object.keys(res.err)[0])
      } catch (e) {
        reject(e);
      }
    });
  }

  async getProfileVersion(): Promise<number> {
    try {
      const Actor = await this.getNoIdentityActor()
      const version = await Actor.getProfileVersion() as bigint
      return Number(version)
    } catch (e) {
      throw e
    }
  }

  async getDataBoxVersion(): Promise<number> {
    try {
      const Actor = await this.getNoIdentityActor()
      const version = await Actor.getDataBoxVersion() as bigint
      return Number(version)
    } catch (e) {
      throw e
    }
  }

  async emitShareBox(box_id: Principal, to: Principal): Promise<Result> {
    try {
      const Actor = await this.getActor()
      return await Actor.emitShareBox(box_id, to) as Result
    } catch (e) {
      throw  e
    }
  }

  async removeShareBox(box_id: Principal, to: Principal): Promise<Result> {
    try {
      const Actor = await this.getActor()
      return await Actor.removeShareBox(box_id, to) as Result
    } catch (e) {
      throw  e
    }
  }

  async removeSharedBox(box_id: Principal, from: Principal): Promise<Result> {
    try {
      const Actor = await this.getActor()
      return await Actor.removeSharedBox(box_id, from) as Result
    } catch (e) {
      throw  e
    }
  }

  async deleteBox(delBoxArgs: DelBoxArgs) {
    try {
      const Actor = await this.getActor()
      const res = await Actor.deleteBox(delBoxArgs) as Result_5 as any
      if (normal_judge(res)) return true
      else throw new Error(error_text(res.err))
    } catch (e) {
      throw e
    }
  }

  async transferOutICP(to: string, amount: number) {
    try {
      const Actor = await this.getActor()
      const tmp1 = getUint8ArrayFromHex(to);
      return await Actor.transferOutICP(tmp1, BigInt(amount * 1e8)) as Result_2
    } catch (e) {
      throw e
    }
  }

  async test() {
    // @ts-ignore
    const api = new MBbox(await this.getAgent())
    const price_icp = await api.getRequiredToken("icp")
    const price_eth = await api.getRequiredToken("eth")
    const price_udt = await api.getRequiredToken("usdt")
    console.log("price", price_eth, price_icp, price_udt)
  }
}

export const MBApi = new MB();
