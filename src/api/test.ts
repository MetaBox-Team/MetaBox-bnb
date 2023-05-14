import {GetAgent} from "@/did/Agent";

export const idlFactory = ({IDL}) => {
  return IDL.Service({
    'get': IDL.Func([], [IDL.Principal, IDL.Nat], ['query']),
    'greet': IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'post': IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({IDL}) => {
  return [];
};


class test {
  async getActor() {
    return await GetAgent.createActor(idlFactory, "gibz6-6yaaa-aaaak-qan7a-cai");
  }

  async post() {
    try {
      const Actor = await this.getActor()
      const res = await Actor.post()
      console.log("post", String(res))
      const res2 = await Actor.get() as any
      console.log("get", String(res2[0]), res2[1])
    } catch (e) {
      console.log(e)
    }
  }
}

export const testApi = new test()
