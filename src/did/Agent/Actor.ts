import {Actor, HttpAgent} from "@dfinity/agent";
import {Principal} from "@dfinity/principal";
import {authClient} from "./IIForIdentity";
import PlugWallet from "@/did/Agent/plugWallet";
import Storage from "@/utils/storage";

export default class UserActor {
  public owner: Principal | undefined;

  async getAgent(): Promise<HttpAgent> {
    try {
      const walletType = Storage.getWalletTypeStorage();
      if (walletType === "II")
        return new HttpAgent({
          identity: await authClient.getIdentity() as any,
          host: "https://ic0.app"
        })
      else if (walletType === "plugWallet") return window.ic.plug.agent as HttpAgent
      else throw new Error("agent error")
    } catch (e) {
      throw e
    }

  }

  //no  identity
  async getNoIdentityAgent() {
    return new HttpAgent({
      host: "https://ic0.app"
    });
  }

  public async createActor(idlFactory: any, canisterId: string | any) {
    return await this.plugSelected(idlFactory, canisterId)
  }

  public async noIdentityActor(IdlFactory: any, canisterId: string) {
    const agent = await this.getNoIdentityAgent();
    return Actor.createActor(IdlFactory, {
      agent,
      canisterId,
    });
  }

  private async plugSelected(idlFactory: any, canisterId: string | any) {
    const walletType = Storage.getWalletTypeStorage();
    switch (walletType) {
      case "II":
        const agent = await this.getAgent();
        return Actor.createActor(idlFactory, {
          agent,
          canisterId,
        });
      case "plugWallet":
        if (!window.ic.plug.agent) await PlugWallet.connect();
        const plug_agent = window.ic.plug.agent
        return Actor.createActor(idlFactory, {
          agent: plug_agent,
          canisterId,
        });
      default:
        throw new Error("wallet error")
    }
  }
}
