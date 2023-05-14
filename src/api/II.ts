import {idlFactory} from "@/did/II.did"
import {Ed25519KeyIdentity} from "@dfinity/identity";
import {Actor, HttpAgent} from "@dfinity/agent";
import {Principal} from "@dfinity/principal";
import {Delegation} from "../../internet-identity/src/frontend/src/flows/authorize/postMessageInterface";
import {GetDelegationResponse, WalletSig} from "@/did/model/II";
import {fromHexString} from "../../agent-js-0.12.0/packages/identity/src/buffer";
import {sha256} from "js-sha256";
import {Wallet} from "../../agent-js-0.12.0/packages/auth-client/src";

type PublicKey = Array<number>;

interface InternetIdentityAuthResponseSuccess {
  delegations: {
    delegation: {
      pubkey: Uint8Array;
      expiration: bigint;
      targets?: Principal[];
    };
    signature: Uint8Array;
  }[];
  userPublicKey: Uint8Array;
}

const ii_cid =
  // "rwlgt-iiaaa-aaaaa-aaaaa-cai"
  "bvdxc-ryaaa-aaaak-qanna-cai"

export class II {
  private readonly identity: Ed25519KeyIdentity

  constructor(identity: Ed25519KeyIdentity) {
    this.identity = identity
  }

  async getActor() {
    const agent = new HttpAgent({
      identity: this.identity,
      host: "https://ic0.app"
    })
    return Actor.createActor(idlFactory, {
      agent,
      canisterId: ii_cid,
    });
  }

  get_pubKey_json() {
    return this.identity.toJSON()
  }

  get_pubKey() {
    return this.identity.getPublicKey()
  }

  async prepare_delegation(address: string, json_pub_key: string, sig: string, walletType: Wallet) {
    const Actor = await this.getActor()
    const arg: WalletSig = walletType === "MetaMask" ? {'MetaMask': [address.slice(2), json_pub_key, sig]} : {'Other': [address, json_pub_key]}
    const res = await Actor.prepare_delegation([BigInt(86400_000_000_000)], arg) as [Uint8Array, bigint]
    console.log(res)
    return await this.get_delegation(address, res, walletType)
  }

  async get_delegation(address: string, arg: [Uint8Array, bigint], walletType: Wallet) {
    const Actor = await this.getActor();
    const array = fromHexString(address.slice(2))
    const seed = walletType === "MetaMask" ? sha256.digest(array) : sha256.digest(address)
    const callBack = async (): Promise<GetDelegationResponse> => {
      return await Actor.get_delegation(seed, [...new Uint8Array(this.get_pubKey().toDer())], arg[1]) as GetDelegationResponse
    }
    const signed_delegation = await retryGetDelegation(callBack)
    const c: [PublicKey, Delegation] = [
      [...arg[0]],
      {
        delegation: {
          pubkey: Uint8Array.from(signed_delegation.delegation.pubkey),
          expiration: BigInt(signed_delegation.delegation.expiration),
          targets: undefined,
        },
        signature: Uint8Array.from(signed_delegation.signature),
      },
    ]
    const [userKey, parsed_signed_delegation] = c
    const d: InternetIdentityAuthResponseSuccess = {
      delegations: [parsed_signed_delegation],
      userPublicKey: Uint8Array.from(userKey)
    }
    return d
  }
}

const retryGetDelegation = async (callback: () => Promise<GetDelegationResponse>, maxRetries = 5,) => {
  for (let i = 0; i < maxRetries; i++) {
    // Linear backoff
    await new Promise((resolve) => {
      setInterval(resolve, 1000 * i);
    });
    const res = await callback()
    if ("signed_delegation" in res) {
      return res.signed_delegation;
    }
  }
  throw new Error(
    `Failed to retrieve a delegation after ${maxRetries} retries.`
  );
}



