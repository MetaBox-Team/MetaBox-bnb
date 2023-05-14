import axios, {AxiosInstance} from "axios";
import {Principal} from "@dfinity/principal";
import {updateEmail} from "@/redux";
import {updateFollowing} from "@/redux/features/following";
import {BoxMetadata} from "@/did/model/MBox";

const BASE_URL_ACTIVITY = process.env.ENDPOINT // `https://api.metabox.rocks`//`https://fff.ic00.app`;
const agent: AxiosInstance = axios.create();

export type EmailOperation = "Accept" | "Refuse"
export type Share_Type = "Box" | "File" | "Transfer" | "cancel_file" | "cancel_box"

export type UnhandledEmail = {
  from: string,
  headline: string,
  description: string,
  share_type: Share_Type,
  share_value: string,
}

export type HandledEmail = {
  unhandled_email: UnhandledEmail
  operation: EmailOperation
}

export type ShareResponse = {
  from: string,
  share_type: Share_Type,
  share_value: string,
  operation: EmailOperation // Accept Refuse Unhandled,
}

export type User = {
  principal: string,
  canister_id: string,
}

export type Response = { "ok": "success" } | { "error": "failed" }

export type Follow_DB = {
  followers: User[]
  following: User[]
}

export type FollowHandlerArgs = {
  follower_principal: string,   // A的principal
  follower_canister_id: string, // A的canister_id
  followed_principal: string,   // B的principal
  followed_canister_id: string, // B的canister_id
}

export type RecentDownloadFile = {
  box_id: string,
  file_key: string,
  file_name: string,
  file_type: string,
}

export type AddRecentDownloadArg = {
  who: Principal,
  box_id: Principal,
  file_key: string,
  file_name: string,
  file_type: string,
}

export type ActivityResponse = {
  scores: number
  finished_activity: boolean[]
}

type t = { metadata: Omit<BoxMetadata, "box_type"> & { box_type: string } }

type OtherNet = "Polygon" | "Arbitrum" | "BSC"
export type EVMNet = "Ethereum Mainnet" | OtherNet
type Net = "Mainnet" | OtherNet

export type CreateBoxByEthArgs = {
  net: EVMNet,
  from: string,
  tx_hash: string,
  user_key: string,
  sig: string,
  args: t
}

export type EVMTopUpArgs = {
  net: EVMNet,
  from: string,
  amount: string, // 充值的USDT数量
  tx_hash: string,
  principal: string, // 被充值的canister principal
  sig: string// 对"{amount}{principal}"进行签名
}

type price = {
  eth: number,
  bnb: number,
  usdt: number
}

class Request {

  topUp(args: EVMTopUpArgs) {
    return new Promise(async (resolve, reject) => {
      try {
        const net: Net = args.net === "Ethereum Mainnet" ? "Mainnet" : args.net
        const Args = {...args, net}
        const response = await agent.post<string>(`${BASE_URL_ACTIVITY}/top_up/usdt`, {
          ...Args
        })
        const data: string = response.data
        console.log(data)
        if (data === "ok") return resolve("ok")
        reject(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  get_cost(token: keyof price) {
    return new Promise<number>(async (resolve, reject) => {
      try {
        const response = await agent.get<price>(`${BASE_URL_ACTIVITY}/create_box/get_recent_price`)
        const data: price = response.data
        const price: number = data[token]
        if (price === null) return resolve(-1)
        return resolve(price)
      } catch (e) {
        reject(e)
      }
    })
  }

  createBoxByOtherToken(token: "eth" | "usdt" | "bnb", args: CreateBoxByEthArgs) {
    return new Promise(async (resolve, reject) => {
      try {
        const net: Net = args.net === "Ethereum Mainnet" ? "Mainnet" : args.net
        const Args = {...args, net}
        const response = await agent.post(`${BASE_URL_ACTIVITY}/create_box/${token}`, {
          ...Args
        })
        const data = response.data
        try {
          Principal.from(data)
          return resolve(response.data)
        } catch (e) {
          return reject(response.data)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  activity(userID: string) {
    return new Promise<ActivityResponse>(async (resolve, reject) => {
        try {
          const response = await agent.get<ActivityResponse>(`${BASE_URL_ACTIVITY}/${userID}`)
          if (response.data) {
            return resolve(response.data)
          } else return reject("error")
        } catch (e) {
          reject(e)
        }
      }
    )
  }

  getUnHandle(who: Principal): Promise<UnhandledEmail[]> {
    return new Promise<UnhandledEmail[]>(async (resolve, reject) => {
        try {
          const response = await agent.post<UnhandledEmail[]>(`${BASE_URL_ACTIVITY}/unhandled`, {
              who: String(who)
            }
          )
          if (response.data) {
            updateEmail({unhandledEmail: response.data})
            return resolve(response.data)
          } else return reject("error")
        } catch (e) {
          reject(e)
        }
      }
    )
  }

  sendEmail(to: Principal, email: UnhandledEmail): Promise<Response> {
    return new Promise<Response>(async (resolve, reject) => {
      try {
        const response = await agent.post<Response>(`${BASE_URL_ACTIVITY}/send`, {
            to: String(to),
            email
          },
        )
        if (response.data) return resolve(response.data)
        else return reject("error")
      } catch (e) {
        reject(e)
      }
    })
  }

  handleEmail(who: Principal, handled_email: HandledEmail): Promise<Response> {
    return new Promise<Response>(async (resolve, reject) => {
      try {
        const response = await agent.post<Response>(`${BASE_URL_ACTIVITY}/handle`, {
            who: String(who),
            handled_email
          },
        )
        if (response.data) return resolve(response.data)
        else return reject("error")
      } catch (e) {
        reject(e)
      }
    })
  }

  get_share_response(who: Principal): Promise<ShareResponse[]> {
    return new Promise<ShareResponse[]>(async (resolve, reject) => {
      try {
        const response = await agent.post<ShareResponse[]>(`${BASE_URL_ACTIVITY}/response`, {
            who: String(who),
          }
        )
        if (response.data) {
          updateEmail({shareResponse: response.data})
          return resolve(response.data)
        } else return reject("error")
      } catch (e) {
        reject(e)
      }
    })
  }

  handle_share_response(who: Principal, res: ShareResponse): Promise<Response> {
    return new Promise<Response>(async (resolve, reject) => {
      try {
        const response = await agent.post<Response>(`${BASE_URL_ACTIVITY}/handle-share`, {
            who: String(who),
            res
          },
        )
        if (response.data) return resolve(response.data)
        else return reject("error")
      } catch (e) {
        reject(e)
      }
    })
  }

  get_follow_db_data(who: Principal) {
    return new Promise<Follow_DB>(async (resolve, reject) => {
      try {
        const response = await agent.get<Follow_DB>(`${BASE_URL_ACTIVITY}/follow/${who.toString()}`)
        if (response.data) {
          return resolve(response.data)
        } else return reject("error")
      } catch (e) {
        reject(e)
      }
    })
  }

  get_follow_db(who: Principal) {
    return new Promise<Follow_DB>(async (resolve, reject) => {
      try {
        const response = await agent.get<Follow_DB>(`${BASE_URL_ACTIVITY}/follow/${who.toString()}`)
        if (response.data) {
          updateFollowing({followers: response.data.followers, following: response.data.following})
          return resolve(response.data)
        } else return reject("error")
      } catch (e) {
        reject(e)
      }
    })
  }

  follow(arg: FollowHandlerArgs) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const response = await agent.post<string>(`${BASE_URL_ACTIVITY}/follow`, {...arg, method: "add"})
        return resolve(response.data === "Follow Handler Successfully")
      } catch (e) {
        reject(e)
      }
    })
  }

  //既可以取消关注他人，也可能取消他人关注自己
  cancel_follow(arg: FollowHandlerArgs) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const response = await agent.post<string>(`${BASE_URL_ACTIVITY}/follow`, {...arg, method: "delete"})
        return resolve(response.data === "Follow Handler Successfully")
      } catch (e) {
        reject(e)
      }
    })
  }

  add_recent_download(arg: AddRecentDownloadArg) {
    return new Promise<Response>(async (resolve, reject) => {
      try {
        const response = await agent.post<Response>(`${BASE_URL_ACTIVITY}/add-download`, {
          ...arg,
          who: String(arg.who),
          box_id: String(arg.box_id)
        })
        if (response.data) return resolve(response.data)
        else return reject("error")
      } catch (e) {
        reject(e)
      }
    })
  }

  delete_recent_download(arg: AddRecentDownloadArg) {
    return new Promise<Response>(async (resolve, reject) => {
      try {
        const response = await agent.post<Response>(`${BASE_URL_ACTIVITY}/delete-download`, {
          ...arg,
          who: String(arg.who),
          box_id: String(arg.box_id)
        })
        if (response.data) return resolve(response.data)
        else return reject("error")
      } catch (e) {
        reject(e)
      }
    })
  }

  get_recent_download(who: Principal) {
    return new Promise<RecentDownloadFile[]>(async (resolve, reject) => {
      try {
        const response = await agent.post<RecentDownloadFile[]>(`${BASE_URL_ACTIVITY}/download`, {
          who: String(who)
        })
        if (response.data) {
          updateEmail({recently_download: response.data})
          return resolve(response.data)
        } else return reject("error")
      } catch (e) {
        reject(e)
      }
    })
  }

}

export const RequestApi = new Request()
