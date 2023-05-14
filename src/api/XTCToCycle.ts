import {idlFactory} from "@/did/XTC.did";
import {BurnArgs} from "@/did/model/XTC";
import Storage from "@/utils/storage";
import {II} from "@/usehooks/useAuth";

class XTCToCycle {

  async getActor() {
    try {
      const type = Storage.getWalletTypeStorage();
      type === II && await window?.ic?.plug.requestConnect({
        whitelist: ["aanaa-xaaaa-aaaah-aaeiq-cai"],
      });
      return await window.ic.plug.createActor({
        canisterId: "aanaa-xaaaa-aaaah-aaeiq-cai",
        interfaceFactory: idlFactory,
      });
    } catch (e) {
      throw e
    }
  }

  async burn(burnArg: BurnArgs): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const Actor = await this.getActor()
        const res = await Actor.burn(burnArg)
        if (Object.keys(res)[0] === "Ok") resolve(res.Ok)
        else reject(Object.keys(res.Err)[0])
      } catch (e) {
        reject(e)
      }
    })
  }
}

export const XTCApi = new XTCToCycle()
