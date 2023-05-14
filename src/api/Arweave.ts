import {genAPI, genArweaveAPI, getBundleFee} from "arseeding-js";
import {getCoinBalance} from "@/utils/common";
import Bignumber from "bignumber.js";
import Arweave from 'arweave';
import {Wallet_Type} from "@/components";

const arweave = Arweave.init({});

export const arseedUrl = "https://arseed.web3infra.dev"

class ArweaveApi {

  static getAllSize(files: (File | Blob)[]) {
    return files.reduce(
      (accumulator, currentValue) => accumulator + currentValue.size,
      0
    );
  }

  static async fileRead(file: File | Blob) {
    return new Promise(async (resolve, reject) => {
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async function (e: any) {
        const result = new Uint8Array(e.target.result)
        return resolve(result)
      }
      reader.onerror = (error) => {
        reject(error)
      }
    })
  }

  async transfer(to: string, amount: number) {
    let key = await arweave.wallets.generate();
    let transaction = await arweave.createTransaction({
      target: to,
      quantity: arweave.ar.arToWinston(amount + "")
    }, key);
    await arweave.transactions.sign(transaction);
    console.log(transaction);
    const response = await arweave.transactions.post(transaction);
    console.log(response);
  }

  async putFileToAr(files: (File | Blob)[], payCurrency: string, walletType: Wallet_Type): Promise<string[]> {
    try {
      walletType === "Everpay" && await window.ethereum.enable()
      const instance = walletType === "Everpay" ? await genAPI(window.ethereum) : await genArweaveAPI(window.arweaveWallet)
      const address = walletType === "Everpay" ? window.ethereum.selectedAddress : await window.arweaveWallet.getActiveAddress()
      const balance = await getCoinBalance(address, [payCurrency])
      const allSize = ArweaveApi.getAllSize(files)
      const fee = await getBundleFee(arseedUrl, String(allSize), payCurrency)
      const formatedFee = new Bignumber(fee.finalFee).dividedBy(new Bignumber(10).pow(fee.decimals)).toString()
      if (+(balance[0].balance) < +formatedFee) {
        alert(`need ${formatedFee} ${payCurrency} to upload`)
        throw new Error("Insufficient balance")
      }
      const allID: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const data = await ArweaveApi.fileRead(file)
        const ops = {
          tags: [
            {name: 'Content-Type', value: file.type},
          ]
        }
        const res = await instance.sendAndPay(arseedUrl, data, payCurrency, ops)
        allID.push(res.order.itemId)
      }
      return allID
    } catch (e) {
      throw e
    }
  }
}

export const ARApi = new ArweaveApi()
