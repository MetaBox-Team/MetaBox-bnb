import {Props} from "@/usehooks/useAuth";


class CStore {
  public common: Props = {
    identity: undefined,
    isAuthClientReady: false,
    principal: undefined,
    logIn: undefined,
    logOut: undefined,
    isAuth: false,
    plugLogIn: undefined,
    subAccountId: undefined,
  };

  actionSave(store: any) {
    this.common = {...store}
  }

}

export const CommonStore = new CStore();
