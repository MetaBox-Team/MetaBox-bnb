import {GetAgent} from "@/did/Agent";
import {Principal} from "@dfinity/principal";
import {updateAllFiles} from "@/redux";
import {idlFactory as DataBoxIDL} from "@/did/DataBox/DataBox.did.js";
import {
  AssetExt,
  Avatar,
  FileExt,
  FileLocation,
  FilePut,
  Result,
  Result_1,
  Result_2,
  Result_5,
  Result_7,
  State
} from "@/did/model/DataBox";
import {DataBox as DataBoxClass, databox_type} from "js-databox"
import {Box} from "js-metabox"
import {IPFSApi} from "@/api/IPFS";
import {nanoid} from "nanoid";
import {normal_judge, retry, sleep, STORE_ONE_MONTH_COST} from "@/utils/common";
import {toast} from "react-toastify";
import {Certificate, RequestId, RequestStatusResponseStatus, SubmitResponse, toHex} from "@dfinity/agent";
import {IDL} from "@dfinity/candid";
import {FuncClass} from "@dfinity/candid/lib/cjs/idl";
import {go_to_error, go_to_success} from "@/utils/T";
import {ReactText} from "react";
import {UploadFile} from "antd/es/upload/interface";
import {MBApi} from "../mB";
import {CommonStore} from "@/store/common.store";
import {AESEncryptApi, ARApi, arseedUrl, RSAEncryptApi} from "@/api";
import {Wallet_Type} from "@/components";
import axios from "axios";

const ONE_BYTE_UPLOAD_USE_CYCLES = 2260
const chunkSize = 1992288

type read_state = "received" | "processing" | "replied" | "rejected" | "unknown" | "done"

export interface Func {
  methodName: string,
  func: FuncClass
}

function decodeReturnValue(types: IDL.Type[], msg: ArrayBuffer) {
  const returnValues = IDL.decode(types, Buffer.from(msg));
  switch (returnValues.length) {
    case 0:
      return undefined;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}

export class DataBox {

  constructor(private readonly canisterID) {
  }

  private static async getAgent() {
    return await GetAgent.getAgent();
  }

  private async getActor() {
    return await GetAgent.createActor(DataBoxIDL, this.canisterID);
  }

  private async getNoIdentityActor() {
    return await GetAgent.DataBoxNoIdentityActor(this.canisterID);
  }

  /**
   * Query methods
   *
   */
  //拥有者获取DataBox当前使用堆内存、内存、cycle余额的状态信息。
  async canisterState(): Promise<{ 'ok': State }> {
    const Actor = await this.getActor()
    const Error = {
      ok: {
        balance: BigInt(0),
        memory_size: BigInt(0),
        stable_memory_size: BigInt(0)
      }
    }
    try {
      const res = await Actor.canisterState() as any
      if (res.ok) return res
      else return Error
    } catch (e) {
      return Error
    }
  }

  // 拥有者获取cycle余额信息
  async cycleBalance() {
    return await (await this.getActor()).cycleBalance() as Result_7;
  }

  //拥有者获取加密文件分享给的用户列表
  async getFileShareOther(encrypt_file: string): Promise<Array<Principal>> {
    try {
      const res = await (await this.getActor()).getFileShareOther(encrypt_file) as any
      if (res.ok) return res.ok
      else return []
    } catch (e) {
      throw e
    }
  }

  async get_all_files_info(): Promise<databox_type.Result_9> {
    try {
      // @ts-ignore
      const dataBoxApi = new DataBoxClass(this.canisterID, await DataBox.getAgent())
      return await dataBoxApi.get_all_files_info()
    } catch (e) {
      throw e;
    }
  }

  async getEncryptExts() {
    const res = await this.get_all_files_info() as any;
    const encryptFile = new Array<AssetExt>();
    for (let i = 0; i < res.ok[1].length; i++) {
      encryptFile.push(res.ok[1][i].EncryptFileExt);
    }
    updateAllFiles({canisterID: this.canisterID, encryptFiles: encryptFile})
    return encryptFile as AssetExt[]
  }

  async getplainExts() {
    const res = await this.get_all_files_info() as any;
    const plainFile = new Array<AssetExt>();
    for (let i = 0; i < res.ok[0].length; i++) {
      plainFile.push(res.ok[0][i].PlainFileExt);
    }
    updateAllFiles({canisterID: this.canisterID, plainFiles: plainFile})
    return plainFile as AssetExt[]
  }

  async getExts(isEncrypt: boolean, fileNumber: number, preLength: number, isDelete: boolean): Promise<boolean> {
    const res = await (await this.getActor()).getAssetexts() as any
    const fileExts = new Array<any>();
    if (isEncrypt) {
      for (let i = 0; i < res.ok[1].length; i++) {
        fileExts.push(res.ok[1][i].EncryptFileExt);
      }
      if (!isDelete) updateAllFiles({canisterID: this.canisterID, encryptFiles: fileExts});
    } else {
      for (let i = 0; i < res.ok[0].length; i++) {
        fileExts.push(res.ok[0][i].PlainFileExt);
      }
      if (!isDelete) updateAllFiles({canisterID: this.canisterID, plainFiles: fileExts});
    }
    return isDelete ? preLength === fileExts.length + fileNumber : preLength + fileNumber === fileExts.length
  }


  async getSharedExts() {
    const res = await this.get_all_files_info() as any;
    const sharedFile = new Array<any>();
    for (let i = 0; i < res.ok[2].length; i++) {
      sharedFile.push(res.ok[2][i].SharedFileExt);
    }
    updateAllFiles({canisterID: this.canisterID, sharedWithMe: sharedFile})
  }

  refresh() {
    try {
      this.getEncryptExts().then()
      this.getplainExts().then();
      this.getSharedExts().then()
      this.getShareFiles().then()
      this.getAllNftFile().then();
    } catch (e) {
      throw e
    }
  }

  refresh_three_time() {
    this.refresh()
    this.refresh()
    this.refresh()
  }

  //获取文件元信息
  async getAssetextkey(file_key: string): Promise<FileExt> {
    return new Promise<FileExt>(async (resolve, reject) => {
      try {
        const res = await (await this.getActor()).getAssetextkey(file_key) as Result_2 as any
        if (res.ok) return resolve(res.ok)
        else return reject(String(Object.keys(res.err)[0]))
      } catch (e) {
        reject(e)
      }
    })
  }

  async getPlain2(file_key: string): Promise<Blob> {
    try {
      // @ts-ignore
      const boxApi = new Box(this.canisterID, await DataBox.getAgent())
      const res = await boxApi.getPlaintextFile(file_key)
      console.log("js-metabox-plain", res)
      return res as Blob
      // @ts-ignore
      const dataBoxApi = new DataBoxClass(this.canisterID, await DataBox.getAgent())
      return await dataBoxApi.get_plain_file(file_key)
    } catch (e) {
      throw e
    }
  }

  async getEncrypt2(file_key: string, private_key: string): Promise<Blob> {
    try {
      // @ts-ignore
      const boxApi = new Box(this.canisterID, await DataBox.getAgent())
      const res = await boxApi.getCiphertextFile(file_key, private_key)
      console.log("js-metabox-ciphertext", res)
      return res as Blob
      // // @ts-ignore
      // const dataBoxApi = new DataBoxClass(this.canisterID, await DataBox.getAgent())
      // if (!!private_key) return await dataBoxApi.get_encrypt_file(file_key, private_key)
      // else throw Error("private key not found")
    } catch (e) {
      throw e
    }
  }

  async getEncryptedDataFromIPFS(fileExt: AssetExt, private_key: string): Promise<Blob> {
    try {
      if ("IPFS" in fileExt.page_field) {
        const url = fileExt.page_field.IPFS
        return await DataBox.getUrlData(fileExt, private_key, url)
      }
      throw new Error("not ipfs file")
    } catch (e) {
      throw e
    }
  }

  static async getUrlData(fileExt: AssetExt, private_key: string, url: string): Promise<Blob> {
    try {
      const res = await axios.get(url, {responseType: "arraybuffer"})
      const data = res.data
      if (data) {
        const privateKey = await RSAEncryptApi.importPrivateKey(private_key);
        const preFileAesKey = await RSAEncryptApi.decryptMessage(
          privateKey,
          fileExt.aes_pub_key[0]
        );
        const AesKey = preFileAesKey.slice(0, 256);
        const AesIv = preFileAesKey.slice(256);
        const plainText = AESEncryptApi.AESDecData(data, AesKey, AesIv);
        return new Blob([plainText.buffer], {
          type: fileExt.file_extension,
        })
      }
      throw new Error("network error")
    } catch (e) {
      throw e
    }
  }

  async getEncryptedDataFromAR(fileExt: AssetExt, private_key: string): Promise<Blob> {
    try {
      if ("Arweave" in fileExt.page_field) {
        const url = fileExt.page_field.Arweave
        return await DataBox.getUrlData(fileExt, private_key, url)
      }
      throw new Error("not arweave file")
    } catch (e) {
      throw e
    }
  }

  async getShareFiles() {
    try {
      const res = await (await this.getActor()).getShareFiles() as any
      const allData = res.ok as [Array<FileExt>, Array<FileExt>]
      if (allData) {
        const myShare = new Array<AssetExt>();
        for (let i = 0; i < allData[0].length; i++) {//@ts-ignore
          myShare.push(allData[0][i].PlainFileExt);
        }
        for (let i = 0; i < allData[1].length; i++) {//@ts-ignore
          myShare.push(allData[1][i].EncryptFileExt);
        }
        updateAllFiles({canisterID: this.canisterID, myShare: myShare})
      } else throw new Error("")
    } catch (e) {
      throw e
    }
  }

  async getOwner(principal: Principal | undefined): Promise<Principal> {
    try {
      return await (await this.getNoIdentityActor()).getOwner() as Principal
    } catch (e) {
      throw e
    }
  }

  async curControl(): Promise<Principal[]> {
    try {
      const Actor = await this.getNoIdentityActor()
      const all_controllers = await Actor.curControl() as [Principal, Array<Principal>]
      return all_controllers[1]
    } catch (e) {
      throw  e
    }
  }

  async getVersion(): Promise<number> {
    try {
      const res = await (await this.getNoIdentityActor()).getVersion()
      return Number(res)
    } catch (e) {
      return 0
    }
  }

  async is_enough_to_upload(total_size: number) {
    try {
      const res = await this.canisterState()
      const balance = Number(res.ok.balance)
      const memory = Number(res.ok.memory_size) + Number(res.ok.stable_memory_size) + total_size
      const GbNumber = (memory / (1024 * 1024 * 1024)).toFixed(4);
      const storeCost = Number(GbNumber) * STORE_ONE_MONTH_COST //加上此次存储大小之后存储一个月花费
      const serious_threshold = storeCost * 2 //保证能存2个月
      const upload_cost = total_size * ONE_BYTE_UPLOAD_USE_CYCLES
      if (upload_cost + serious_threshold > balance) {
        const double = (upload_cost + serious_threshold - balance) / 1e12
        const float = double.toFixed(2)
        return Number(float) + 0.01
      } else return -1
    } catch (e) {
      throw e
    }
  }

  /**
   * Update methods
   *
   *
   */

  async deleteCon(to: Principal): Promise<Result_1> {
    try {
      const Actor = await this.getActor()
      return await Actor.deleteCon(to) as Result_1
    } catch (e) {
      throw e
    }
  }

  async transferOwner(to: Principal): Promise<Result_1> {
    try {
      const Actor = await this.getActor()
      return await Actor.transferOwner(to) as Result_1
    } catch (e) {
      throw e
    }
  }


  //拥有者分享加密文件，使用被分享者默认公钥加密AES密钥得到的密文存入，注册分享信息
  async setShareFile(
    encrypt_file: string,
    other: Principal,
    default_aes_pubkey: string,
  ): Promise<Result_1> {
    try {
      return await (
        await this.getActor()
      ).setShareFile(encrypt_file, other, default_aes_pubkey) as Result_1;
    } catch (e) {
      throw  e
    }
  }

  //拥有者删除加密文件的分享注册信息
  async deleteShareFile(
    encrypt_file: string,
    other: Principal
  ) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const re = await (await this.getActor()).deleteShareFile(encrypt_file, other) as any
        if (re.ok) resolve(true)
        reject(re)
      } catch (error) {
        reject(error);
      }
    });
  }

  //拥有者删除被分享文件的注册信息
  async deleteSharedFile(shared_file_key_arr: string[]) {
    const Actor = await this.getActor();
    return new Promise(async (resolve, reject) => {
      const all_promise: Promise<Result_1>[] = []
      try {
        shared_file_key_arr.forEach(e => {
          all_promise.push(Actor.deleteSharedFile(e) as Promise<Result_1>)
        })
        const res = await Promise.all(all_promise)
        if (res.every(e => normal_judge(e))) return resolve("ok");
        reject("err")
      } catch (error) {
        reject(error);
      }
    });
  }


  private static async getFunc(theIDL: Function, method: string): Promise<Func> {
    const service = theIDL({IDL})
    for (const [methodName, func] of service._fields) {
      if (methodName === method) {
        return {
          methodName: methodName,
          func: func
        }
      }
    }
    throw new Error("该did没有这个方法")
  }


  private static async get_file_info(file: File | Blob) {
    const file_size = file.size
    const allData = await DataBoxClass.FileRead(file)
    const file_type = file.type
    const total_index = Math.ceil(file_size / chunkSize)
    return {file_size, allData, total_index, file_type}
  }

  private one_call(methodName: string, arg: ArrayBuffer, index: number) {
    return (): Promise<{ data: SubmitResponse, index: number }> => {
      return new Promise(async (resolve, reject) => {
        const agent = await DataBox.getAgent();
        const cid = this.canisterID
        const response = await agent.call(cid, {
          methodName,
          arg: arg,
          effectiveCanisterId: cid,
        })
        if (response.response.ok) return resolve({data: response, index})
        else return reject("call failed")
      })
    }
  }


  private async call_all(methodName: string, args: ArrayBuffer[], toastId: ReactText, all_file_chunks: number, progress: { molecular: number }): Promise<RequestId[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const chunkPromises = new Array<() => Promise<{ data: SubmitResponse, index: number }>>();
        for (let i = 0; i < args.length; i++) {
          const arg = args[i]
          if (i !== 0 && i % 30 === 0) await sleep(2000)
          chunkPromises.push(this.one_call(methodName, arg, i))
          setTimeout(() => {
            if (progress.molecular < all_file_chunks) progress.molecular += 0.5
            toast.update(toastId, {render: "🦄 uploading...", progress: progress.molecular / (all_file_chunks + 5)})
          }, 500)
        }
        const res = await retry<SubmitResponse>(chunkPromises, 3)
        const all_request_id: RequestId[] = []
        res.forEach(e => all_request_id.push(e.data.requestId))
        return resolve(all_request_id)
      } catch (e) {
        reject("call failed")
      }
    })
  }

  private async check(all_keys: string[]): Promise<boolean> {
    for (let i = 0; i < all_keys.length; i++) {
      const key = all_keys[i]
      try {
        await this.getAssetextkey(key)
      } catch (e: any) {
        if (e.message === "FileKeyErr") return false
        else throw e
      }
    }
    return true
  }

  private turn_upload_file(all_keys: string[], all_chunks: number, toastId: ReactText, all_file_chunks: number, progress: { molecular: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let count = 0
        const query_times = Math.ceil(all_chunks / 2) + 10
        const timer = setInterval(async () => {
          if (count === query_times) {
            clearInterval(timer)
            return resolve(false)
          }
          count++;
          if (progress.molecular < all_file_chunks) progress.molecular += 1
          toast.update(toastId, {render: "🦄 uploading...", progress: progress.molecular / (all_file_chunks + 5)})
          const res = await this.check(all_keys)
          if (res) {
            clearInterval(timer)
            return resolve(true)
          }
        }, 2000)
      } catch (e) {
        reject(e)
      }
    })
  }

  private read_state(requestId: RequestId, index: number) {
    return () => {
      return new Promise<{ data: read_state, index: number }>(async (resolve, reject) => {
        try {
          const agent = await DataBox.getAgent()
          const path = [new TextEncoder().encode('request_status'), requestId]
          const currentRequest = await agent.createReadStateRequest?.({paths: [path]})
          const state = await agent.readState(this.canisterID, {paths: [path]}, undefined, currentRequest)
          if (agent.rootKey == null) return reject('Agent root key not initialized before polling')
          const cert = await Certificate.create({
            certificate: state.certificate,
            rootKey: agent.rootKey,
            canisterId: Principal.from(this.canisterID),
          });
          const maybeBuf = cert.lookup([...path, new TextEncoder().encode('status')])
          let status: read_state;
          if (typeof maybeBuf === 'undefined') {
            status = RequestStatusResponseStatus.Unknown;
          } else {
            status = new TextDecoder().decode(maybeBuf) as read_state;
          }

          if (status === "replied") {
            const a = cert.lookup([...path, 'reply'])!;
            const putFunc = await DataBox.getFunc(DataBoxIDL, "put")
            const decodedResult = decodeReturnValue(putFunc.func.retTypes, a) as unknown as Result_2
            if ("err" in decodedResult) return reject(Object.keys(decodedResult.err)[0])
          }
          if (status === "rejected") {
            const rejectCode = new Uint8Array(cert.lookup([...path, 'reject_code'])!)[0];
            const rejectMessage = new TextDecoder().decode(cert.lookup([...path, 'reject_message'])!);
            return reject(
              ` Call was rejected:\n` +
              `  Request ID: ${toHex(requestId)}\n` +
              `  Reject code: ${rejectCode}\n` +
              `  Reject text: ${rejectMessage}\n`,
            );
          }
          return resolve({data: status, index})
        } catch (e) {
          reject(e)
        }
      })
    }
  }

  private check_by_read_state(all_request_id: RequestId[]) {
    return new Promise<read_state[]>(async (resolve, reject) => {
      try {
        const all_read_state_promise = new Array<() => Promise<{ data: read_state, index: number }>>()
        for (let i = 0; i < all_request_id.length; i++) {
          const requestId = all_request_id[i]
          if (i !== 0 && i % 30 === 0) await sleep(2000)
          all_read_state_promise.push(this.read_state(requestId, i))
        }
        const res = await retry<read_state>(all_read_state_promise, 3)
        const state_arr: read_state[] = []
        res.forEach(e => state_arr.push(e.data))
        return resolve(state_arr)
      } catch (e) {
        reject(e)
      }
    })
  }

  private put_on_file(isEncrypt: boolean, methodName: string, one_file_args: ArrayBuffer[], file_key: string, toastId: ReactText, all_file_chunks: number, progress: { molecular: number }) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const res = await this.launch_and_check_one_file(isEncrypt, methodName, one_file_args, file_key, toastId, all_file_chunks, progress)
        return resolve(res)
      } catch (e) {
        reject(e)
      }
    })
  }

  private async end(toastId: ReactText, all_file_results_promise: Promise<boolean>[]) {
    try {
      const res = await Promise.all(all_file_results_promise)
      if (res.every(e => e)) go_to_success(toastId, "upload success")
      else go_to_error(toastId, "upload failed")
    } catch (e) {
      console.log(e)
      go_to_error(toastId, "upload failed")
    } finally {
      setTimeout(() => {
        toast.dismiss(toastId)
      }, 500)
    }
  }

  private static get_all_chunks(files: File[]) {
    let all_chunks = 0
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      all_chunks += Math.ceil(file.size / chunkSize)
    }
    return all_chunks
  }


  putPlainFile(files: File[], is_private: boolean, toastId: ReactText) {
    return new Promise(async () => {
      try {
        const all_file_results_promise: Promise<boolean>[] = []
        const putFunc = await DataBox.getFunc(DataBoxIDL, "put")
        const all_file_chunks = DataBox.get_all_chunks(files)
        const progress = {molecular: 0}
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const key = nanoid()
          const one_file_args: ArrayBuffer[] = []
          const {file_size, allData, total_index, file_type} = await DataBox.get_file_info(file)
          for (let i = 0; i < allData.length; i++) {
            const arg = IDL.encode(putFunc.func.argTypes, [
              {
                PlainFilePut: {
                  IC: {
                    file_extension: file_type,
                    order: BigInt(i),
                    chunk_number: BigInt(total_index),
                    chunk: {data: allData[i]},
                    aes_pub_key: [],
                    file_name: file.name,
                    file_key: key,
                    total_size: BigInt(file_size),
                    is_private: is_private
                  }
                }
              }
            ])
            one_file_args.push(arg)
          }
          all_file_results_promise.push(this.put_on_file(false, putFunc.methodName, one_file_args, key, toastId, all_file_chunks, progress))
        }
        await this.end(toastId, all_file_results_promise)
      } catch (e) {
        console.log(e)
        go_to_error(toastId, String(e))
      } finally {
        await sleep(500)
        toast.dismiss(toastId)
      }
    })
  }

  private get_new_args(args: ArrayBuffer[], read_state_res_arr: read_state[]) {
    const new_args: ArrayBuffer[] = []
    read_state_res_arr.forEach((read_state_res, index) => {
      if (read_state_res !== "replied") {
        new_args.push(args[index])
      }
    })
    return {new_args}
  }

  private async launch_and_check_one_file(isEncrypt: boolean, methodName: string, args: ArrayBuffer[], all_file_key: string, toastId: ReactText, all_file_chunks: number, progress: { molecular: number }, maxRetries: number = 3): Promise<boolean> {
    try {
      const allChunkNumber = args.length
      const all_request_id = await this.call_all(methodName, args, toastId, all_file_chunks, progress)
      const is_success = await this.turn_upload_file([all_file_key], allChunkNumber, toastId, all_file_chunks, progress)
      if (is_success) {
        return true
      } else {
        if (maxRetries <= 0) throw new Error("上传失败..")
        const res = await this.check_by_read_state(all_request_id)
        const {new_args} = this.get_new_args(args, res)
        await sleep(1000)
        maxRetries--;
        return await this.launch_and_check_one_file(isEncrypt, methodName, new_args, all_file_key, toastId, all_file_chunks, progress, maxRetries)
      }
    } catch (e) {
      throw e
    }
  }


  private static async getEncryptData(file: File, publicKey: string) {
    const {file_size, allData, file_type} = await DataBox.get_file_info(file)
    const data = new Uint8Array(file_size)
    for (let i = 0; i < allData.length; i++) {
      data.set(allData[i], i * chunkSize)
    }
    const {encData, encryptedAesKey} = await DataBoxClass.encryptFileData(data, publicKey)
    const NewBlob = new Blob([encData], {type: file_type})
    return {NewBlob, encryptedAesKey}
  }


  async putEncryptFile(files: File[], is_private: boolean, public_key: string, toastId: ReactText) {
    try {
      const all_file_results_promise: Promise<boolean>[] = []
      const putFunc = await DataBox.getFunc(DataBoxIDL, "put")
      const all_file_chunks = DataBox.get_all_chunks(files)
      const progress = {molecular: 0}
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const key = nanoid()
        const one_file_args: ArrayBuffer[] = []
        const {NewBlob, encryptedAesKey} = await DataBox.getEncryptData(file, public_key)
        const {file_size: encoded_size, allData: encryptedData, total_index} = await DataBox.get_file_info(NewBlob)
        for (let i = 0; i < encryptedData.length; i++) {
          const arg: FilePut = {
            EncryptFilePut: {
              IC: {
                file_extension: file.type,
                order: BigInt(i),
                chunk_number: BigInt(total_index),
                chunk: {data: encryptedData[i]},
                aes_pub_key: [encryptedAesKey],
                file_name: file.name,
                file_key: key,
                total_size: BigInt(encoded_size),
                is_private: is_private
              }
            }
          }
          const arg_encoded = IDL.encode(putFunc.func.argTypes, [arg])
          one_file_args.push(arg_encoded)
        }
        all_file_results_promise.push(this.put_on_file(true, putFunc.methodName, one_file_args, key, toastId, all_file_chunks, progress))
      }
      await this.end(toastId, all_file_results_promise)
    } catch (e) {
      console.log(e)
      go_to_error(toastId, String(e))
    } finally {
      await sleep(500)
      toast.dismiss(toastId)
    }
  }


  async put(g: FilePut): Promise<Result_2> {
    try {
      return await (await this.getActor()).put(g) as Result_2
    } catch (e) {
      throw e
    }
  }

  async putEncryptedFileToIFPS(files: File[], is_private: boolean, toastId: ReactText, publicKey: string) {
    const Actor = await this.getActor()
    const allBlobs: Blob[] = []
    const aesKeyArr: string[] = []
    const allEncryptedFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const {NewBlob, encryptedAesKey} = await DataBox.getEncryptData(file, publicKey)
      aesKeyArr.push(encryptedAesKey)
      allBlobs.push(NewBlob)
    }
    allBlobs.forEach((e, k) => {
      const fileItem = files[k]
      const item = new File([e], fileItem.name, {type: fileItem.type})
      allEncryptedFiles.push(item)
    })
    const res = await IPFSApi.put_ipfs_file(allEncryptedFiles)
    const allPromise: Array<Promise<any>> = []
    for (let i = 0; i < allEncryptedFiles.length; i++) {
      const file = allEncryptedFiles[i]
      const file_key = nanoid()
      const arg: FilePut = {
        EncryptFilePut: {
          Other: {
            file_extension: file.type,
            aes_pub_key: aesKeyArr[i] ? [aesKeyArr[i]] : [],
            file_name: file.name,
            file_key,
            total_size: BigInt(file.size),
            is_private: is_private,
            page_field: {'IPFS': `https://${res}.ipfs.w3s.link/${file.name}`},
          }
        }
      }
      allPromise.push(Actor.put(arg))
    }
    try {
      await Promise.all(allPromise)
      go_to_success(toastId, "上传成功....")
    } catch (e) {
      go_to_error(toastId, String(e))
      throw e
    } finally {
      setTimeout(() => {
        toast.dismiss(toastId)
      }, 2000)
    }
  }

  async putPlainFileToIPFS(files: File[], is_private: boolean, toastId: ReactText) {
    try {
      const Actor = await this.getActor()
      const res = await IPFSApi.put_ipfs_file(files)
      const allPromise: Array<Promise<any>> = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const file_key = nanoid()
        const arg: FilePut = {
          PlainFilePut: {
            Other: {
              file_extension: file.type,
              aes_pub_key: [],
              file_name: file.name,
              file_key,
              total_size: BigInt(file.size),
              is_private: is_private,
              page_field: {'IPFS': `https://${res}.ipfs.w3s.link/${file.name}`},
            }
          }
        }
        allPromise.push(Actor.put(arg))
      }
      await Promise.all(allPromise)
      go_to_success(toastId, "上传成功....")
    } catch (e) {
      go_to_error(toastId, String(e))
      throw e
    } finally {
      setTimeout(() => {
        toast.dismiss(toastId)
      }, 2000)
    }
  }

  async putPlainFileToAr(files: File[], is_private: boolean, toastId: ReactText, payCurrency: string, walletType: Wallet_Type) {
    try {
      const Actor = await this.getActor()
      const res = await ARApi.putFileToAr(files, payCurrency, walletType)
      const allPromise: Array<Promise<any>> = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const file_key = nanoid()
        const arg: FilePut = {
          PlainFilePut: {
            Other: {
              file_extension: file.type,
              aes_pub_key: [],
              file_name: file.name,
              file_key,
              total_size: BigInt(file.size),
              is_private: is_private,
              page_field: {'Arweave': `${arseedUrl}/${res[i]}`},
            }
          }
        }
        allPromise.push(Actor.put(arg))
      }
      await Promise.all(allPromise)
      go_to_success(toastId, "上传成功....")
    } catch (e) {
      go_to_error(toastId, String(e))
      throw e
    } finally {
      setTimeout(() => {
        toast.dismiss(toastId)
      }, 2000)
    }
  }

  async putEncryptFileToAr(files: File[], is_private: boolean, toastId: ReactText, payCurrency: string, walletType: Wallet_Type, publicKey: string) {
    try {
      const Actor = await this.getActor()
      const allBlobs: Blob[] = []
      const aesKeyArr: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const {NewBlob, encryptedAesKey} = await DataBox.getEncryptData(file, publicKey)
        aesKeyArr.push(encryptedAesKey)
        allBlobs.push(NewBlob)
      }
      const res = await ARApi.putFileToAr(allBlobs, payCurrency, walletType)
      const allPromise: Array<Promise<any>> = []
      for (let i = 0; i < allBlobs.length; i++) {
        const blob = allBlobs[i]
        const file = files[i]
        const file_key = nanoid()
        const arg: FilePut = {
          EncryptFilePut: {
            Other: {
              file_extension: file.type,
              aes_pub_key: aesKeyArr[i] ? [aesKeyArr[i]] : [],
              file_name: file.name,
              file_key,
              total_size: BigInt(blob.size),
              is_private: is_private,
              page_field: {'Arweave': `${arseedUrl}/${res[i]}`},
            }
          }
        }
        allPromise.push(Actor.put(arg))
      }
      await Promise.all(allPromise)
      go_to_success(toastId, "上传成功....")
    } catch (e) {
      go_to_error(toastId, String(e))
      throw e
    } finally {
      setTimeout(() => {
        toast.dismiss(toastId)
      }, 2000)
    }
  }

  async addCon(to: Principal): Promise<Result_1> {
    try {
      const Actor = await this.getActor();
      return await Actor.addCon(to) as Result_1
    } catch (e) {
      throw e
    }
  }

  async deletekey2(isEncrypt: boolean, keyArr: string[]) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        // @ts-ignore
        const dataBoxApi = new DataBoxClass(this.canisterID, await DataBox.getAgent())
        const deletePromiseArr = new Array<Promise<databox_type.Result_1>>();
        for (let i = 0; i < keyArr.length; i++) {
          deletePromiseArr.push(isEncrypt ? dataBoxApi.delete_box_encrypted_file(keyArr[i]) : dataBoxApi.delete_box_plain_file(keyArr[i]));
        }
        const res = await Promise.all(deletePromiseArr)
        if (res.every(e => Object.keys(e)[0] === "ok")) return resolve(true)//@ts-ignore
        else return reject(String(Object.keys(res[0].err)[0]))
      } catch (e) {
        throw e
      }
    })
  }

  async addPrivatePlainShare(file_key: string, to: Principal): Promise<databox_type.Result_1> {
    try {
      // @ts-ignore
      const dataBoxApi = new DataBoxClass(this.canisterID, await DataBox.getAgent())//@ts-ignore
      return await dataBoxApi.addPrivatePlainShare({file_key, to})
    } catch (e) {
      throw  e
    }
  }

  async is_need_upgrade() {
    try {
      // @ts-ignore
      const dataBoxApi = new DataBoxClass(this.canisterID, await DataBox.getAgent())
      return await dataBoxApi.is_need_upgrade()
    } catch (e) {
      throw e
    }
  }

  async removePrivatePlainShare(file_key: string, other: Principal) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        // @ts-ignore
        const dataBoxApi = new DataBoxClass(this.canisterID, await DataBox.getAgent())//@ts-ignore
        const res = await dataBoxApi.removePrivatePlainShare({file_key, to: other})
        if (Object.keys(res)[0] === "ok") return resolve(true)//@ts-ignore
        else return reject(String(Object.keys(res.err)[0]))
      } catch (e) {
        reject(e)
      }
    })
  }

  async upload_avatar(file: UploadFile) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (file.size && file.originFileObj && file.type) {
          const principal = CommonStore.common.principal
          if (file.size > chunkSize) return reject("不能上传大于2MB的文件")
          const Actor = await this.getActor()
          const reader = new FileReader();
          const file_key = nanoid()
          reader.readAsArrayBuffer(file.originFileObj)
          reader.onload = async (e: any) => {
            const u8 = new Uint8Array(e.target.result)
            const arg: Avatar = {
              data: u8,
              data_type: file.type ?? ""
            }
            const res = await Actor.uploadAvatar(arg, file_key) as Result
            if (normal_judge(res)) {
              MBApi.getBoxes(principal).then()
              return resolve(file_key)//@ts-ignore
            } else return reject(String(Object.keys(res.err)[0]))
          }
        } else return reject("file error")
      } catch (e) {
        reject(e)
      }
    })
  }

  public async getFileNums(fileLocation: FileLocation): Promise<Result_7> {
    try {
      const Actor = await this.getActor();
      return await Actor.getFileNums(fileLocation) as Result_7
    } catch (e) {
      throw e
    }
  }

  /**
   * 分页get数据
   *
   * @param {FileLocation} fileLocation 文件位置
   * @param {number} onePageFileNums 每一页的数据大小 不能超过5000
   * @param {number} pageIndex 取哪一页
   * @example
   * getPageFiles({Plain:null},2,0) 取明文数据，每一页有两个数据，取第一页
   */
  public getPageFiles(fileLocation: FileLocation, onePageFileNums: number, pageIndex: number) {
    return new Promise<FileExt[]>(async (resolve, reject) => {
      try {
        const Actor = await this.getActor();
        const res = await Actor.getPageFiles(fileLocation, BigInt(onePageFileNums), BigInt(pageIndex)) as Result_5 as any
        if (Object.keys(res)[0] === "ok") return resolve(res.ok)
        else return reject(Object.keys(res.err)[0])
      } catch (e) {
        throw e
      }
    })
  }

  //拥有者清空整个DataBox，remake了
  async clearall() {
    return await (await this.getActor()).clearall();
  }

  //接收cycles
  async wallet_receive() {
    return await (await this.getActor()).wallet_receive();
  }

  async clearBuffer() {
    try {
      const Actor = await this.getActor()
      await Actor.clearBuffer()
    } catch (e) {
      throw e
    }
  }

  async memAlign() {
    try {
      const Actor = await this.getActor()
      await Actor.memAlign()
    } catch (e) {
      throw e
    }
  }

  async mintNftFile(fileKey: string): Promise<Result> {
    try {
      const Actor = await this.getActor()
      const result = await Actor.mintNftFile([fileKey]) as [Result]
      return result[0]
    } catch (e) {
      throw e
    }
  }

  async mintNftCollection(): Promise<boolean> {
    try {
      const Actor = await this.getActor()
      return await Actor.mintNftCollection() as boolean
    } catch (e) {
      throw e
    }
  }

  async isNftFile(fileKeys: string[]) {
    try {
      const Actor = await this.getActor()
      return await Actor.isNftFile(fileKeys) as boolean[]
    } catch (e) {
      throw e
    }
  }

  async getAllNftFile() {
    try {
      const Actor = await this.getActor()
      const res = await Actor.getAllNftFile() as FileExt[]
      updateAllFiles({canisterID: this.canisterID, nfts: res})
    } catch (e) {
      throw e
    }
  }

  async isNftCollection() {
    try {
      const Actor = await this.getActor()
      return await Actor.isNftCollection() as boolean
    } catch (e) {
      throw e
    }
  }

}

export const DataBoxApi = (canisterID: string) => new DataBox(canisterID);
