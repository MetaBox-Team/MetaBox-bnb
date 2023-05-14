import storage from "@/utils/storage";
import {Identity} from "@dfinity/agent";
import {Principal} from "@dfinity/principal";
import {AuthClient, Wallet} from "../../../agent-js-0.13.1/packages/auth-client/src";

export class IIForIdentity {
  public authClient: AuthClient | undefined;
  public principal: Principal | undefined;
  public subAccountId: string | undefined;
  public identity: Identity | undefined;
  private isAuthClientReady: undefined | boolean = false;

  constructor() {
    // this.create();
    return this;
  }

  async create() {
    this.authClient = await AuthClient.create({
      idleOptions: {
        idleTimeout: 1000 * 60 * 30, // set to 30 minutes
        disableDefaultIdleCallback: true // disable the default reload behavior
      }
    });
    this.isAuthClientReady = await this.authClient?.isAuthenticated();
  }

  public setOwnerPrincipal(principal: Principal | undefined) {
    this.principal = principal;
  }

  //ii login
  async login(walletType: Wallet) {
    return new Promise<Identity | undefined>(async (resolve, reject) => {
      this.authClient?.login({
        walletType,
        maxTimeToLive: BigInt(86400_000_000_000),
        derivationOrigin: "https://37s5e-paaaa-aaaao-afmca-cai.ic0.app",
        onSuccess: async () => {
          this.identity = this.authClient?.getIdentity() as Identity | undefined;
          this.principal = this.identity?.getPrincipal();
          this.isAuthClientReady = await this.authClient?.isAuthenticated();
          resolve(this.identity);
        },
        onError: (err) => {
          reject(err);
        },
      });
    });
  }

  //II
  async logout() {
    storage.removeStorage();
    localStorage.removeItem("mb_user_password")
    localStorage.removeItem("isMetaMask")
    await this.authClient?.logout({returnTo: "/"});
    location.reload()
  }

  async getIdentity() {
    return this.authClient?.getIdentity();
  }

  async isAuthenticated() {
    return this.authClient?.isAuthenticated();
  }

  //II
  async checkLogin() {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      this.authClient = authClient;
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}

export const authClient = new IIForIdentity();
