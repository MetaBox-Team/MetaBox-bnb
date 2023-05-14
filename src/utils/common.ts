/* global BigInt */
import {DelegationIdentity} from "@dfinity/identity";
import {getCrc32} from "@dfinity/principal/lib/esm/utils/getCrc";
import * as SHA1 from "@dfinity/principal/lib/esm/utils/sha224";
import {Buffer} from "buffer";
import {Principal} from "@dfinity/principal";
import {EVMNet, MBApi, ProfileApi, RequestApi, User} from "@/api";
import {toast} from "react-toastify";
import {Profile__1} from "@/did/model/Profile";
import {AssetExt, FilePut} from "@/did/model/DataBox";
import {RcFile, UploadFile} from "antd/es/upload/interface";
import {message} from "antd";
import {sharedType} from "@/redux";
import {BalanceItem, EverpayInfo, EverpayTransaction, FeeItem, Token} from "everpay/cjs/types";
import Everpay from "everpay";
import {CacheApi, PrincipalNotFound, PROFILENotFound} from "@/api/cache";
import {fromHexString} from "../../agent-js-0.12.0/packages/identity/src/buffer";
import {EverPayTokenBalance} from "@/views/Deposit";
import {ethers} from "ethers";
import {ERC20ABI} from "@/config";
import {USDT} from "@/components";
import React, {ReactText} from "react";

interface retry_type<T> {
  data: T,
  index: number
}

export const STORE_ONE_MONTH_COST = 329184000000

export const delete_recent_download = (fileExt: AssetExt | sharedType, principal: Principal) => {
  //@ts-ignore
  const cid: Principal = fileExt.bucket_id ?? fileExt.other
  principal && RequestApi.delete_recent_download({
    who: principal,
    box_id: cid,
    file_key: fileExt.file_key,
    file_name: fileExt.file_name,
    file_type: fileExt.file_extension
  }).then(() => RequestApi.get_recent_download(principal))
}

export const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export const onPreview = async (file: UploadFile) => {
  let src = file.url as string;
  if (!src) {
    src = await new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as RcFile);
      reader.onload = () => resolve(reader.result as string);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};

export const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export const size_unit = (Size: number) => {
  if (Size > (1024 * 1024 * 1024)) {
    return `${(Size / (1024 * 1024 * 1024)).toFixed(2)}G`
  } else if (Size > (1024 * 1024)) {
    return `${(Size / (1024 * 1024)).toFixed(2)}M`
  } else if (Size > 1024) {
    return `${(Size / 1024).toFixed(2)}KB`
  }
  return `${Size} B`
}

export const get_all_keys = (fileArr: AssetExt[]) => {
  const plain_key_arr: string[] = []
  const encrypt_key_arr: string[] = []
  const ipfs_arr: string[] = []
  const ipfs_key_arr: string[] = []
  fileArr.forEach(e => {
    if (Object.keys(e.page_field)[0] === "IPFS") {//@ts-ignore
      ipfs_arr.push(e.page_field.IPFS)
      ipfs_key_arr.push(e.file_key)
    } else e.aes_pub_key[0] ? encrypt_key_arr.push(e.file_key) : plain_key_arr.push(e.file_key)
  })
  return {plain_key_arr, encrypt_key_arr, ipfs_arr, ipfs_key_arr}
}


export const retry = async <T>(promise_arr: (() => Promise<retry_type<T>>)[], maxRetries: number, success_arr: retry_type<T>[] = new Array(promise_arr.length).fill(undefined)): Promise<retry_type<T>[]> => {
  return new Promise<retry_type<T>[]>(async (resolve, reject) => {
    try {
      const all_promise: Promise<retry_type<T>>[] = []
      const new_arr: (() => Promise<retry_type<T>>)[] = []
      for (let i = 0; i < promise_arr.length; i++) {
        all_promise.push(promise_arr[i]())
      }
      const res = await Promise.allSettled(all_promise)
      for (let i = 0; i < res.length; i++) {
        const item = res[i]
        if (item.status === "fulfilled") success_arr[item.value.index] = item.value
        else new_arr.push(promise_arr[i])
      }
      if (success_arr.every(e => !!e)) return resolve(success_arr)
      if (maxRetries <= 0) {
        const message = "reason" in res[0] ? res[0].reason : "执行失败"
        return reject(message)
      }
      maxRetries--;
      const result = await retry(new_arr, maxRetries, success_arr)
      return resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}


export const get_other_info_2 = async (other_arr: (string | Principal)[]) => {
  const info_arr: Profile__1[] = []
  const profile_arr: string[] = []
  for (let i = 0; i < other_arr.length; i++) {
    const item = other_arr[i]
    let profile_cid: Principal | undefined
    try {
      const profile = await CacheApi.get_profile(Principal.from(item))
      profile_cid = Principal.from(profile)
    } catch (e) {
      profile_cid = await MBApi.getProfile(Principal.from(item))
    }
    if (profile_cid) {
      try {
        profile_arr.push(profile_cid.toString())
        const profile_api = ProfileApi(profile_cid.toString())
        const info = await profile_api.getProfileInfo()
        info_arr.push(info)
      } catch (e) {
        profile_arr.push("")
        info_arr.push({
          'name': "加载失败",
          'description': "加载失败",
          avatar_url: ""
        })
      }
    } else {
      profile_arr.push("")
      info_arr.push({
        'name': "加载失败",
        'description': "加载失败",
        avatar_url: ""
      })
    }
  }
  return {info_arr, profile_arr}
}

export const get_other_info = async (other_arr: User[]) => {
  const info_arr: Profile__1[] = []
  for (let i = 0; i < other_arr.length; i++) {
    const item = other_arr[i]
    const profile_cid = item.canister_id
    if (profile_cid) {
      try {
        const profile_api = ProfileApi(profile_cid.toString())
        const info = await profile_api.getProfileInfo()
        info_arr.push(info)
      } catch (e) {
        info_arr.push({
          'name': "加载失败",
          'description': "加载失败",
          avatar_url: ""
        })
      }
    } else {
      info_arr.push({
        'name': "加载失败",
        'description': "加载失败",
        avatar_url: ""
      })
    }
  }
  return {info_arr}
}

export const normal_judge = (result) => {
  return Object.keys(result)[0] === "ok"
}

export const error_text = (result) => {
  return Object.keys(result)[0]
}

export const timer = (tip: string, time?: number) => {
  toast.error(tip)
  return setTimeout(() => {
    window.location.replace("/")
  }, time ?? 2000)
}

export const get_principal = async (anchor: string): Promise<Principal> => {
  try {
    return Principal.from(anchor)
  } catch (e) {
    let principal
    try {
      principal = await CacheApi.get_prinid(anchor)
      if (principal === PrincipalNotFound) principal = String(await MBApi.getPrincipalFromName(anchor))
    } catch (e) {
      principal = String(await MBApi.getPrincipalFromName(anchor))
    }
    return Principal.from(principal)
  }
}

/**
 * @param {String} str - hex string
 * @returns
 */
export const getUint8ArrayFromHex = (str: string): Uint8Array => {
  return Uint8Array.from(Buffer.from(str, "hex"));
};

/**
 * Whether a principal is delegated from a delegation identity.
 * @param {*} principal -- the principal string to be checked
 * @param {*} delegationIdentityAccount
 * @returns -- true for yes, false for no.
 */
export const isDelegateByAccount = (principal, delegationIdentityAccount) => {
  const publicKey = DelegationIdentity.fromDelegation(
    principal,
    delegationIdentityAccount.delegationChain
  )
  .getPublicKey()
  .toDer();
  return publicKey === delegationIdentityAccount.publicKey;
};

/**
 *
 * @param {Principal} principal
 * @param {*} s
 * @returns
 */
export const principalToAccountIdentifier = (principal, s) => {
  const padding = new Buffer("\x0Aaccount-id");
  const array = new Uint8Array([
    ...padding,
    ...principal.toUint8Array(),
    ...getSubAccountArray(s),
  ]);
  const hash = SHA1.sha224(array);
  const checksum = to32bits(getCrc32(hash));
  const array2 = new Uint8Array([...checksum, ...hash]);
  return toHexString(array2);
};
export const getToAccountIdentifier = (principal, s) => {
  const padding = new Buffer("\x0Aaccount-id");
  const array = new Uint8Array([
    ...padding,
    ...principal.toUint8Array(),
    ...getPrincipalSubAccountArray(s),
  ]);
  const hash = SHA1.sha224(array);
  const checksum = to32bits(getCrc32(hash));
  const array2 = new Uint8Array([...checksum, ...hash]);
  return toHexString(array2);
};
export const getPrincipalSubAccountArray = (principal) => {
  const p = Array.from(principal.toUint8Array());
  let tmp = Array(1).fill(p.length).concat(p);
  while (tmp.length < 32) tmp.push(0);
  return tmp;
};
export const getSubAccountArray = (s) => {
  return Array(28)
  .fill(0)
  .concat(to32bits(s ? s : 0));
};
const to32bits = (num) => {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};
const toHexString = (byteArray: Uint8Array) => {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
};

export function toHexString_2(bytes: ArrayBuffer): string {
  return new Uint8Array(bytes).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

export const checkMnemonic = (mne) => {
  const english = require("bip39wordlist/english.json").list;
  for (const i of mne) {
    if (!english.includes(i)) {
      return false;
    }
  }

  return true;
};

export const toThousands = (num) => {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
};

export const exportToCSV = (exportTitle: string[], exportData: any[]) => {
  const fileName = "fileExt.csv";
  let row = "",
    csvData = "";
  for (const title of exportTitle) {
    row += '"' + title + '",';
  }
  csvData += row + "\r\n"; // 添加换行符号
  for (const item of exportData) {
    row = "";
    for (let key in item) {
      row += '"' + item[key] + '",';
    }
    csvData += row + "\r\n"; // 添加换行符号
  }
  if (!csvData) return;
  let alink = document.createElement("a");
  // 解决中文乱码的问题，标识该字节流的字节序
  let _utf = "\uFEFF";
  const bw = browser();
  console.log(bw)
  if (bw["edge"] || !bw["ie"]) {
    // Blob IE>=10 都支持，不能作为判断依据
    // @ts-ignore
    if (window.Blob && window.URL && window.URL.createObjectURL) {
      // DOMStrings会被编码为UTF-8，utf-8保存的csv格式要让Excel正常打开的话，必须加入在文件最前面加入BOM(Byte order mark)
      const csvDataBlob = new Blob([_utf + csvData], {
        type: "text/csv",
      });
      //会产生一个类似 blob:http://localhost:8083/5a2d03ec-cbdf-4ea9-be0c-f837ed35a9be 这样的URL字符串,
      //可以像使用普通 URL 那样使用它，比如用在 img.src 上。
      alink.href = URL.createObjectURL(csvDataBlob);
    }
    document.body.appendChild(alink);
    alink.setAttribute("download", fileName);
    alink.click();
    document.body.removeChild(alink);
  } else if (bw["ie"] >= 10) {
    const csvDataBlob = new Blob([_utf + csvData], {
      type: "text/csv",
    });
    //@ts-ignore
    navigator.msSaveBlob(csvDataBlob, fileName);
  }
}

const browser = () => {
  let Sys: any = {};
  let ua = navigator.userAgent.toLowerCase();
  let s;
  (s =
    ua.indexOf("edge") !== -1
      ? (Sys.edge = "edge")
      : ua.match(/rv:([\d.]+)\) like gecko/))
    ? (Sys.ie = s[1])
    : (s = ua.match(/msie ([\d.]+)/))
      ? (Sys.ie = s[1])
      : (s = ua.match(/firefox\/([\d.]+)/))
        ? (Sys.firefox = s[1])
        : (s = ua.match(/chrome\/([\d.]+)/))
          ? (Sys.chrome = s[1])
          : (s = ua.match(/opera.([\d.]+)/))
            ? (Sys.opera = s[1])
            : (s = ua.match(/version\/([\d.]+).*safari/))
              ? (Sys.safari = s[1])
              : 0;
  return Sys;
}

export const getEverPayBalance = async (address: string): Promise<BalanceItem[]> => {
  const everpay = new Everpay()
  return await everpay.balances({
    account: address
  })
}

export const getFee = async (tokenTag: string[]): Promise<FeeItem[]> => {
  const result: FeeItem[] = []
  const everpay = new Everpay()
  const fees = await everpay.fees()
  tokenTag.forEach(e => {
    const item = fees.find(v => v.tokenTag === e)
    if (!item) throw new Error(`token ${e} not exist`)
    result.push(item)
  })
  return result
}

export const getCoinInfo = async (tokens: string[]): Promise<Token[]> => {
  const everpay = new Everpay()
  const info: EverpayInfo = await everpay.info()
  const tokenList: Token[] = info.tokenList
  const result: Token[] = []
  tokens.forEach(v => {
    const item = tokenList.find(e => e.symbol === v)
    if (!item) throw new Error(`symbol ${v} not exist`)
    result.push(item)
  })
  return result
}

export const getCoinBalance = async (address: string, tokens: string[]): Promise<BalanceItem[]> => {
  const balance: BalanceItem[] = await getEverPayBalance(address)
  const res: BalanceItem[] = []
  tokens.forEach(v => {
    const t = balance.find(e => e.symbol === v)
    if (!t) throw new Error(`symbol ${v} not exist`)
    res.push(t)
  })
  return res
}

export const buildUpEverPayToken = async (address: string, tokens: string[]) => {
  const result: EverPayTokenBalance[] = []
  const [balance, info] = await Promise.all([getCoinBalance(address, tokens), getCoinInfo(tokens)])
  const tags: string[] = []
  info.forEach(e => tags.push(e.tag))
  const fees: FeeItem[] = await getFee(tags)
  balance.forEach((e, k) => {
    const infoItem = info[k]
    const feeItem = fees[k]
    result.push({
      balance: +e.balance,
      ...feeItem,
      ...infoItem
    })
  })
  return result
}

export const inquireWithdrawEverpayTx = async (everHash: string): Promise<boolean> => {
  const everpay = new Everpay()
  const tx: EverpayTransaction = await everpay.txByHash(everHash)
  const targetChainHash = tx.targetChainTxHash
  if (targetChainHash !== undefined) {
    if (targetChainHash === "") {
      await sleep(10000)
      return await inquireWithdrawEverpayTx(everHash)
    } else return true
  }
  return false
}

export const SeedToPrincipal = (u8Seed: number[]) => {
  const my_canister_id = [0, 0, 0, 0, 1, 80, 3, 90, 1, 1];
  const bitstring: number[] = []
  bitstring.push(my_canister_id.length);
  bitstring.push(...my_canister_id);
  bitstring.push(...u8Seed)
  const der: number[] = []
  der.push(0x30)
  der.push(17 + bitstring.length)
  der.push(...[
    // sequence of length 12 for the OID
    0x30, 0x0C, // OID 1.3.6.1.4.1.56387.1.2
    0x06, 0x0A, 0x2B, 0x06, 0x01, 0x04, 0x01, 0x83, 0xB8, 0x43, 0x01, 0x02,
  ])
  der.push(0x03);
  der.push(1 + bitstring.length);
  der.push(0x00);
  der.push(...bitstring);
  return Principal.selfAuthenticating((new Uint8Array(der)))
}

export const get_eth_address = async () => {
  const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
  return accounts[0]
}

export const TransferUSDT = (value: number, network: EVMNet) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      await window.ethereum.enable();
      const address = await get_eth_address()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const tokenInst = new ethers.Contract(USDT[network].address, ERC20ABI, signer)
      const balance = await tokenInst.balanceOf(address)
      const formatBalance = +ethers.utils.formatUnits(balance, USDT[network].decimals)
      if (formatBalance <= value) return reject("Insufficient balance")
      const amount = ethers.utils.parseUnits(value + "", USDT[network].decimals)
      const res = await tokenInst.transfer(process.env.ETH_ADDRESS, amount)
      const hash = res.hash
      return resolve(hash)
    } catch (e) {
      reject(e)
    }
  })
}

const check = async (tx: string): Promise<number> => {
  const a = await window.ethereum.request({
    method: "eth_getTransactionReceipt",
    params: [tx]
  })
  if (a !== null) return +a.status
  await sleep(1000)
  return await check(tx)
}

export const checkTxStatusWrap = (txHash: string, toastId: ReactText) => {
  return new Promise<{ tx_hash: string, toastID: React.ReactText }>(async (resolve, reject) => {
    const status = await check(txHash)
    if (+status) return resolve({tx_hash: txHash, toastID: toastId})
    reject("tx failed")
  })
}
