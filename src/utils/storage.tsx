import { WalletType } from "../usehooks/useAuth"
export type { WalletType } from "../usehooks/useAuth"
export type walletKeyType = "WALLET_TYPE_KEY"
export default class Storage {
    static walletType: WalletType | unknown
    static walletTypeKey: walletKeyType = "WALLET_TYPE_KEY"
    static setWalletTypeStorage(value: any) {
        return localStorage.setItem(this.walletTypeKey, value)
    }

    static getWalletTypeStorage() {
        return localStorage.getItem(this.walletTypeKey)
    }
    static removeStorage() {
        return localStorage.removeItem(this.walletTypeKey)
    }

    static setPrivateKeyStorage(key: string, value: any) {
        return localStorage.setItem(key, value)
    }
    static getPrivateKeyStorage(key: string) {
        return localStorage.getItem(key)
    }
    static removePrivateKeyStorage(key: string) {
        return localStorage.removeItem(key)
    }
}
