import {GetAgent} from "@/did/Agent";
import idlFactory from "@/did/ledger.did";
import {getUint8ArrayFromHex, principalToAccountIdentifier,} from "@/utils/common";
import {updateBalance} from "@/redux";
import {ICP} from "@/did/model/ledger";
import {CommonStore} from "@/store/common.store";
import {Principal} from "@dfinity/principal";

class Ledger {
  async getActor() {
    return await GetAgent.createActor(
      idlFactory,
      "ryjl3-tyaaa-aaaaa-aaaba-cai"
    );
  }

  async getNoIdentityActor() {
    return await GetAgent.noIdentityActor(
      idlFactory,
      "ryjl3-tyaaa-aaaaa-aaaba-cai"
    );
  }

  async account_balance(): Promise<void> {
    const str = CommonStore.common.subAccountId;
    if (str) {
      const tmp = getUint8ArrayFromHex(str);
      const accountIdentifier = Array.from(tmp);
      const res = (await (
        await this.getNoIdentityActor()
      ).account_balance({account: accountIdentifier})) as any;
      res.e8s ? updateBalance(Number(res.e8s) / 1e8) : updateBalance(0);
    }
  }

  async real_account_balance(principal: Principal): Promise<any> {
    const tmp = getUint8ArrayFromHex(
      principalToAccountIdentifier(principal, 0)
    );
    const accountIdentifier = Array.from(tmp);
    return (await (
      await this.getNoIdentityActor()
    ).account_balance({account: accountIdentifier})) as any;
  }

  async getBalance(account: string) {
    const tmp = getUint8ArrayFromHex(account)
    const res = (await (
      await this.getNoIdentityActor()
    ).account_balance({account: tmp})) as any;
    console.log(res)
  }

  async transfer(
    to: string,
    memo: number,
    from: Principal,
    amount: any
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const tmp1 = getUint8ArrayFromHex(to);
        const _to = Array.from(tmp1);
        const fee: ICP = {e8s: BigInt(10000)};
        const tmp = getUint8ArrayFromHex(principalToAccountIdentifier(from, 0));
        const _from = Array.from(tmp);
        const _amount = amount - 10000;
        const res = await (
          await this.getActor()
        ).transfer({
          to: _to,
          fee: fee,
          memo: memo,
          from_subaccount: [],
          created_at_time: [],
          amount: {e8s: _amount},
        });
        // if (res.Err) reject(Object.keys(res.Err)[0]);
        resolve(res);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export const LedgerApi = new Ledger();
