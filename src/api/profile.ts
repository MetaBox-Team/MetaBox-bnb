import {GetAgent} from "@/did/Agent"
import {idlFactory as profileIDL} from "@/did/profile.did"
import {Actor} from "@dfinity/agent";
import {
  Avatar,
  Link,
  Profile__1,
  PUT,
  Result,
  Result_1,
  Result_2,
  Result_5,
  SetLinkArgs,
  SetProfileArgs
} from "@/did/model/Profile";
import {updateKeyStore, updateLinks, updateProfileStore} from "@/redux";
import {Principal} from "@dfinity/principal";
import {UploadFile} from "antd/es/upload/interface";
import {nanoid} from "nanoid";
import {MBApi} from "@/api/mB";
import {error_text, normal_judge} from "@/utils/common";

const chunkSize = 1992288

export class Profile {

  constructor(public canisterID) {
  }

  async getActor() {
    return await GetAgent.createActor(profileIDL, this.canisterID);
  }

  async getNoIdentityActor() {
    return await GetAgent.noIdentityActor(profileIDL, this.canisterID)
  }

  async setProfile(arg: SetProfileArgs): Promise<Result_1> {
    try {
      const Actor = await this.getActor()
      return await Actor.setProfile(arg) as Result_1
    } catch (e) {
      throw e
    }
  }

  async getLinks() {
    try {
      const Actor = await this.getActor()
      const res = await Actor.getLinks() as Link[]
      updateLinks(res)
    } catch (e) {
      throw e
    }
  }

  async setLink(arg: SetLinkArgs): Promise<Result_1> {
    try {
      const Actor = await this.getActor()
      return await Actor.setLink(arg) as Result_1
    } catch (e) {
      throw e
    }
  }

  async getProfileInfo() {
    try {
      const Actor = await this.getActor()
      return await Actor.getProfile() as Profile__1
    } catch (e) {
      throw e
    }
  }

  async updateProfileInfo() {
    try {
      const res = await this.getProfileInfo()
      fetch(res.avatar_url).then(e => {
        updateProfileStore({
          name: res.name,
          description: res.description,
          avatar_url: e.ok ? res.avatar_url : undefined
        })
      })
    } catch (e) {
      throw e
    }
  }

  async getEncryptedSecretKey(): Promise<Result_5> {
    try {
      const Actor = await this.getActor()
      return await Actor.getEncryptedSecretKey() as Result_5
    } catch (e) {
      throw e
    }
  }

  async getPublicKey(): Promise<string> {
    try {
      const Actor = await this.getNoIdentityActor()
      const pub_key = await Actor.getPublicKey() as [] | [string]
      return pub_key[0] ?? ""
    } catch (e) {
      throw e
    }
  }

  set_public_key(publicKey: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const Actor = await this.getActor()
        const res = await Actor.setPublicKey([publicKey]) as Result
        if (normal_judge(res)) return resolve("ok")
        else return reject("error")
      } catch (e) {
        return reject(e)
      }
    })
  }

  set_private_key(encryptedPrivateKey: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const Actor = await this.getActor()
        const res = await Actor.setEncryptedSecretKey([encryptedPrivateKey]) as Result
        if (normal_judge(res)) return resolve("ok")
        else return reject("error")
      } catch (e) {
        return reject(e)
      }
    })
  }

  async addLink(link: Link): Promise<Result> {
    try {
      const Actor = await this.getActor()
      return await Actor.addLink(link) as Result
    } catch (e) {
      throw e
    }
  }

  async getOwner(): Promise<Principal> {
    try {
      const Actor = await this.getActor()
      return await Actor.getOwner() as Principal
    } catch (e) {
      throw e
    }
  }

  async delLink(linkUrl: string): Promise<boolean> {
    try {
      const Actor = await this.getActor()
      const res = await Actor.delLink(linkUrl) as Result as any
      if (normal_judge(res)) return true
      throw new Error(error_text(res.err))
    } catch (e) {
      throw e
    }
  }


  async getVersion(): Promise<number> {
    try {
      const res = await (await this.getNoIdentityActor()).getVersion()
      return Number(res)
    } catch (e) {
      return 0
    }
  }

  async auto_upgrade(): Promise<any> {
    return new Promise<string>(async (resolve) => {
      try {
        const profile_version = await this.getVersion()
        const new_profile_version = await MBApi.getProfileVersion()
        if (profile_version < new_profile_version) {
          const res = await MBApi.upgradeBox({
            'status': {'running': null},
            'canister_id': Principal.from(this.canisterID) as any,
            'is_private': true,
            'box_name': "",
            'box_type': {'profile': null},
          })
          if (res === "ok") return resolve("ok")
          else return resolve("upgrade failed")
        } else resolve("no need")
      } catch (e) {
        resolve("error")
      }
    })
  }

  async putLinkImage(file: UploadFile) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (file.size && file.originFileObj && file.type) {
          if (file.size > chunkSize) return reject("不能上传大于2MB的文件")
          const Actor = await this.getActor()
          const reader = new FileReader();
          const file_key = nanoid()
          reader.readAsArrayBuffer(file.originFileObj)
          reader.onload = async (e: any) => {
            const u8 = new Uint8Array(e.target.result)
            const arg: PUT = {
              'file_extension': file.type ?? "",
              'chunk_number': BigInt(1),
              'chunk': {data: u8},
              'file_name': file.name,
              'file_key': file_key,
              'total_size': BigInt(file.size ?? 0),
              'chunk_order': BigInt(0),
            }
            const res = await Actor.putLinkImage(arg) as Result_2 //@ts-ignore
            if (res.ok) {
              return resolve(file_key)//@ts-ignore
            } else return reject(String(Object.keys(res.err)[0]))
          }
        } else return reject("file error")
      } catch (e) {
        reject(e)
      }
    })
  }

  async setAvatar(file?: UploadFile): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (file) {
          const Actor = await this.getActor()
          const reader = new FileReader();
          if (file.originFileObj && file.type) {
            const type = file.type
            reader.readAsArrayBuffer(file.originFileObj)
            reader.onload = async (e: any) => {
              const u8 = new Uint8Array(e.target.result)
              const arg: Avatar = {
                image_data: u8,
                image_type: type
              }
              const res = await Actor.setAvatar(arg)
              if (normal_judge(res)) resolve(nanoid())
            }
          } else throw new Error("data is empty");
        } else resolve("")
      } catch (e) {
        reject(e)
      }
    })
  }
}

export const ProfileApi = (canisterID: string) => new Profile(canisterID);
