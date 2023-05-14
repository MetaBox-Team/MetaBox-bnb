import moment from "moment";
import {IPFSApi} from "@/api/IPFS";
import {Contractor, CreateCollectionArgs, Evm} from "@mix-labs/contracts";
import {ethers} from "ethers";
import {BoxAllInfo} from "@/did/model/MBox";
import {AssetExt} from "@/did/model/DataBox";
import {MintTokenArgs} from "@mix-labs/contracts/src/types";

export type Category = "art" | "music" | "space";

interface Resource {
  type: Category;
  image?: string;
  ipfsChainimageUrl?: string;
  ipfsChainbannerUrl?: string;
  banner?: string;
}

const provider = new ethers.providers.Web3Provider(window.ethereum)
const config = {
  addresses: {
    singleCollective: "0x9ED826624d295a8B276947d567a5438Be83aaACC",
    multipleCollective: "0x16F88C3af47971Eeb071bdcDD8fcA146BE5F7C90",
    market: "",
    creation: "",
    curation: "",
  },
  provider: provider,
};
const contractClient = Contractor(Evm, config);

export class Mint {

  private static getUri(image: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const unix = moment().unix();
        const resource: Resource = {
          type: "art",
          image,
        }
        const manifest = new File(
          [
            JSON.stringify({
              time: unix,
              ...resource,
            }),
          ],
          `${unix}.json`,
          {
            type: "text/plain",
          }
        );
        const ipfs_key = await IPFSApi.put_ipfs_file([manifest])
        const uri = `https://${ipfs_key}.ipfs.w3s.link/${manifest.name}`
        return resolve(uri)
      } catch (e) {
        reject(e)
      }
    })
  }

  mintCollection(boxItem: BoxAllInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        const boxImage = `https://${boxItem.canister_id.toString()}.raw.ic0.app/avatar/${boxItem.avatar_key}`
        const uri = await Mint.getUri(boxImage)
        const param: CreateCollectionArgs = {
          category: "ART",
          name: boxItem.box_name,
          description: "",
          uri,
          tags: [],
          payees: [],
          royalties: [],
          maximum: 30,
          type: "single",
        };
        console.log(param)
        const res = await contractClient.createCollection(param);
        await res.wait();
        console.log(res)
        return resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }

  mintToken(fileExt: AssetExt, collection: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const image = `https://${fileExt.bucket_id.toString()}.raw.ic0.app/file/${fileExt.file_key}`
        const uri = await Mint.getUri(image)
        const param: MintTokenArgs = {
          type: "single",
          balance: 1,
          collection,
          name: fileExt.file_name,
          description: "",
          uri,
        }
        const tx2 = await contractClient.mintToken(param)
        await tx2.wait();
        console.log(tx2)
        return resolve("success")
      } catch (e) {
        reject(e)
      }
    })
  }

}

export const MintApi = new Mint()
