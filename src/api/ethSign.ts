const cid = "skgse-qiaaa-aaaap-aaw4a-cai"


import {GetAgent} from "@/did/Agent";

type SigArg = {
  "address": string,
  "msg": string,
  "sig": string,
}
const idlFactory = ({IDL}) => {
  return IDL.Service({
    'verify_metamask_personal_sign': IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text],
      [IDL.Bool],
      ['query'],
    ),
  });
};
export const init = ({IDL}) => {
  return [];
};

class ETHVerify {

  async getActor() {
    return await GetAgent.createActor(idlFactory, cid);
  }

  async verify(arg: SigArg) {
    try {
      const Actor = await this.getActor()
      const res = await Actor.verify_metamask_personal_sign(arg.address, arg.msg, arg.sig)
      console.log("verify result: ", res)
    } catch (e) {
      throw e
    }
  }
}

export const verifyApi = new ETHVerify()
