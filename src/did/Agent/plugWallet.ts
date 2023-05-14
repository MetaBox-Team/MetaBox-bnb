//@ts-nocheck
import {getToAccountIdentifier, principalToAccountIdentifier} from "@/utils/common";
import {Principal} from "@dfinity/principal";
import Storage from "@/utils/storage";
import {plug} from "@/usehooks/useAuth";

const whitelist = [
  "zbzr7-xyaaa-aaaan-qadeq-cai",
  "ryjl3-tyaaa-aaaaa-aaaba-cai",
  "aanaa-xaaaa-aaaah-aaeiq-cai"
];
export default class PlugWallet {
  static whitelist: Array<string> = whitelist;

  static async verifyConnectionAndAgent(): Promise<{
    principal: Principal;
    subAccountId: string;
  }> {
    const connected = await window.ic.plug.isConnected();
    if (!connected) window.ic.plug.requestConnect({whitelist});
    if (connected && !window.ic.plug.agent) {
      await window.ic.plug.createAgent({
        whitelist: this.whitelist,
      });
    }
    const principal = await window?.ic?.plug?.agent?.getPrincipal();
    const subAccountId = getToAccountIdentifier(Principal.from("zbzr7-xyaaa-aaaan-qadeq-cai"), principal)
    return {principal, subAccountId};
  }

  static async updateAgentWhitelist(canisterIds: Array<string>) {
    if (Storage.getWalletTypeStorage() === plug) {
      const tmp: string[] = [];
      canisterIds.map((v, k) => {
        if (!this.whitelist.includes(v)) tmp.push(v);
      });
      this.whitelist = this.whitelist.concat(tmp);
      tmp.length > 0 && await this.connect();
    }
  }

  static getWhiteList() {
    return this.whitelist;
  }

  static async createAgent() {
    return await window.ic.plug.createAgent({
      whitelist: this.whitelist,
    });
  }

  static async connect() {
    return await window?.ic?.plug.requestConnect({
      whitelist: this.whitelist,
    });
  }

  static async getBalance() {
    return await window?.ic?.plug.requestBalance();
  }
}
