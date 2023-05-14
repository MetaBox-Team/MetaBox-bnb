import {Principal} from "@dfinity/principal"
import {sha256} from "js-sha256"
import {idlFactory} from "@/did/MBox.did"
import {IDL} from "@dfinity/candid";
import {Func} from "@/api/DataBox";


const append = [108, 76, 51, 57, 55, 82, 37, 83, 33, 74, 65, 107, 122, 121, 85, 48, 52, 40, 73, 111, 105, 79, 88, 75, 100, 97, 117, 114, 36, 56, 78, 50,]

class Api {

  private static async getFunc(): Promise<Func> {
    const service = idlFactory({IDL})
    for (const [methodName, func] of service._fields) {
      if (methodName === "createProfile") {
        return {
          methodName: methodName,
          func: func
        }
      }
    }
    throw new Error("该did没有这个方法")
  }

  async get_auth_token(principal: Principal) {
    try {
      const arr = Array.from(principal.toUint8Array())
      const res = arr.concat(append)
      const hash = sha256.digest(res)
      const Func = await Api.getFunc()
      return await IDL.encode(Func.func.argTypes, [hash])
    } catch (e) {
      throw  e
    }
  }
}

export const authApi = new Api()
