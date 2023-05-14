import {GetAgent} from "@/did/Agent";
import {idlFactory} from "@/did/CMC.did";
import {updateRate} from "@/redux";
import {Principal} from "@dfinity/principal";

class Cmc {
  async getActor() {
    return await GetAgent.noIdentityActor(
      idlFactory,
      "rkp4c-7iaaa-aaaaa-aaaca-cai"
    );
  }

  async getCycle(balance: number, setAllCycle: Function) {
    const res = await (await this.getActor()).get_icp_xdr_conversion_rate() as any
    const xdr_per_icp = Number(res.data.xdr_permyriad_per_icp)
    updateRate(xdr_per_icp).then()
    setAllCycle(balance * xdr_per_icp)
  }

  async notify_create_canister(controller: Principal, block_index: number): Promise<any> {
    return await (await this.getActor()).notify_create_canister({
      controller: controller,
      block_index: block_index
    })
  }

  async notify_top_up(block_index: number, canister_id: Principal): Promise<any> {
    return await (await this.getActor()).notify_top_up({
      block_index: block_index,
      canister_id: canister_id
    })
  }
}

export const CMCApi = new Cmc()
