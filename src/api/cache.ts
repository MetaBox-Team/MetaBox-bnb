import axios, {AxiosInstance} from "axios";
import {Principal} from "@dfinity/principal";


const agent: AxiosInstance = axios.create();

const BASE_URL_ACTIVITY = process.env.ENDPOINT
const URL = `${BASE_URL_ACTIVITY}/metabox_query`

export const PubKeyNotFound = "PubKeyNotFound"
export const UserIdNotFound = "UserIdNotFound"
export const PROFILENotFound = "ProfileNotFound"
export const PrivateKeyNotFound = "PrivateKeyNotFound"
export const PrincipalNotFound = "PrincipalNotFound"


class Cache {

  get_profile(who: Principal) {
    return new Promise<string>(async (resolve, reject) => {
        try {
          const response = await agent.get<any>(`${URL}/user_profile/${String(who)}`)
          if (!response.data.error) {
            return resolve(response.data)
          } else return resolve(PROFILENotFound)
        } catch (e) {
          reject(e)
        }
      }
    )
  }

  get_pubkey(who: Principal) {
    return new Promise<string>(async (resolve, reject) => {
        try {
          const response = await agent.get<any>(`${URL}/user_public_key/${String(who)}`)
          if (!response.data.error) {
            return resolve(response.data)
          } else return resolve(PubKeyNotFound)
        } catch (e) {
          reject(e)
        }
      }
    )
  }

  get_userid(who: Principal) {
    return new Promise<string>(async (resolve, reject) => {
        try {
          const response = await agent.get<any>(`${URL}/userid_from_pid/${String(who)}`)
          if (!response.data.error) {
            return resolve(response.data)
          } else return resolve(UserIdNotFound)
        } catch (e) {
          reject(e)
        }
      }
    )
  }

  get_prinid(userID: string) {
    return new Promise<string>(async (resolve, reject) => {
        try {
          const response = await agent.get<any>(`${URL}/pid_from_userid/${userID}`)
          if (!response.data.error) {
            return resolve(response.data)
          } else return resolve(PrincipalNotFound)
        } catch (e) {
          reject(e)
        }
      }
    )
  }
}

export const CacheApi = new Cache()
