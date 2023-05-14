// import React, {useEffect, useState} from "react";
// import {LoginStyles as Styled} from "./styles";
// import {SignUp, SignIn, WalletSignIn} from "./components";
// import {useAuth} from "@/usehooks/useAuth";
// import {
//   updateBoxes, updateOwnerStore,
//   updateProfileStore, useBoxesStore,
//   useOwnerStore,
// } from "@/redux";
// import {useParams} from "react-router-dom";
// import {LedgerApi, MBApi, ProfileApi, RequestApi} from "@/api";
// import {get_principal, normal_judge, timer} from "@/utils/common";
// import {Principal} from "@dfinity/principal";
// import {useAsync} from 'react-use';
// import {useTranslation} from "react-i18next";
// import {CacheApi} from "@/api/cache";
// import {useCache} from "@/usehooks/useCache";
//
// function Login() {
//   const {user}: { user: string | undefined } = useParams()
//   const {principal, isAuth} = useAuth();
//   const {profileID, publicKey} = useCache()
//   const [isReset, setIsReset] = useState(false)
//   const {user_principal} = useOwnerStore()
//   const {profile} = useBoxesStore()
//   const {t} = useTranslation()
//   const isAuthPrincipal = React.useMemo(() => String(principal).length === 63, [principal])
//
//   const my_info = useAsync(async () => {
//     if (isAuthPrincipal) {
//       return await get_self_info()
//     }
//   }, [isAuthPrincipal]);
//
//   const user_info = useAsync(async () => {
//     if (user_principal && isAuthPrincipal) {
//       fetchData()
//       return await get_user_profile_info(user_principal)
//     }
//   }, [user_principal, profile]);
//
//   const needAuth = async () => {
//     LedgerApi.account_balance().then()
//     MBApi.isFirstDataBox().then()
//     MBApi.getICP().then()
//   }
//
//   const withoutAuth = async () => {
//     MBApi.getDataBoxVersion().then(e => updateBoxes({data_box_new_version: e}))
//     if (principal) {
//       const my_profile_id = await CacheApi.get_profile(principal)
//       if (my_profile_id) {
//         const profileApi = ProfileApi(my_profile_id)
//
//       } else {
//         if (user) window.location.replace("/")
//         else return 0
//       }
//     }
//   }
//
//
//   const turn_email = (user_principal: Principal) => {
//     if (user_principal.toString() === String(principal)) {
//       RequestApi.get_recent_download(user_principal)
//       setInterval(() => {
//         RequestApi.getUnHandle(user_principal)
//         RequestApi.get_share_response(user_principal)
//       }, 10000)
//     }
//   }
//
//   const get_user_profile_info = async (user_principal: Principal) => {
//     const user_profile = await MBApi.getProfile(user_principal)
//     if (user_profile) {
//       // OGApi.getOgNum(user_principal).then()
//       const user_profileApi = ProfileApi(String(user_profile))
//       user_profileApi.updateProfileInfo().then()
//       user_profileApi.getLinks().then()
//       const upgrade_res = await user_profileApi.auto_upgrade()
//       if (upgrade_res !== "ok" && upgrade_res !== "no need") {
//         timer(t("toast.not_upgrade"), 5000)
//       }
//       updateBoxes({profile: String(user_profile)})
//       return String(user_profile)
//     } else {
//       if (user_principal.toString() !== String(principal)) {
//         timer(t("toast.not_signUp"))
//       } else return 0
//     }
//   }
//
//   const fetchData = () => {
//     MBApi.getBoxes(user_principal).then();
//   };
//
//   const Compared = async () => {
//     if (isAuthPrincipal) {
//       try {
//         if (user) {
//           const user_principal = await get_principal(user)
//           updateOwnerStore({isOwner: String(principal) === String(user_principal), user_principal})
//         } else updateOwnerStore({isOwner: true, user_principal: principal})
//       } catch (e) {
//         timer(t("toast.no_user"), 0)
//       }
//     }
//   }
//
//   useEffect(() => {
//     isAuthPrincipal && Compared().then()
//   }, [String(principal)])
//
//   useEffect(() => {
//     // if (user_principal) turn_email(user_principal)
//   }, [String(user_principal)])
//
//   const get_self_info = async () => {
//     LedgerApi.account_balance().then()
//     MBApi.getDataBoxVersion().then(e => updateBoxes({data_box_new_version: e}))
//     if (principal) {
//       MBApi.isFirstDataBox().then()
//       MBApi.getICP().then()
//       const e = await MBApi.getProfile(principal)
//       if (e) {
//         const profileApi = ProfileApi(e.toString())
//         profileApi.getPublicKey().then()
//         profileApi.auto_upgrade().then(e => e !== "no need" && e !== "ok" && location.reload())
//         const re = await profileApi.getEncryptedSecretKey() as any
//         if (normal_judge(re)) {
//           updateProfileStore({
//             pre_private_key: re.ok[0]
//           })
//           return re.ok[0]
//         } else return 0
//       } else {
//         if (user) window.location.replace("/")
//         else return 0
//       }
//     } else return 0
//   }
//
//   useEffect(() => {
//     // console.log("finally", String(principal))
//     // isAuthPrincipal && MBApi.createBox({
//     //   'is_private': true,
//     //   'box_name': "string",
//     //   'box_type': {data_box: null},
//     // }).then(e => {
//     //   console.log("createBox", e.toString())
//     // })
//     // isAuthPrincipal && testApi.post()
//     // isAuthPrincipal && console.log(String(principal))
//   }, [isAuthPrincipal])
//
//   return (
//     <Styled.Background>
//       <Logo/>
//       {!isAuth ? <WalletSignIn/>
//         : my_info.loading || user_info.loading ? <LoadingImg/>
//           : !!my_info.value && !!user_info.value && !isReset ? <SignIn setIsReset={setIsReset}/>
//             : <SignUp isReset={isReset}/>
//       }
//       {/*<LoadingBag/>*/}
//     </Styled.Background>
//   );
// }
//
// export default Login;
//
// const LoadingImg = React.memo(() => {
//   return <Styled.LoadingImg>
//     <Styled.LoadingItemWhite/>
//     <Styled.LoadingItemBlue/>
//   </Styled.LoadingImg>
// })
//
// const LoadingBag = React.memo(() => {
//   return <Styled.LoadingBag/>
// })
//
// const Logo = React.memo(() => {
//   return <Styled.LoginHead>
//     <Styled.LogoWrap>
//       <Styled.Logo/>
//       <div style={{width: '2rem'}}/>
//       <div style={{
//         background: "url(./metabox.jpg) no-repeat center center",
//         height: "4.5rem",
//         width: "25rem",
//         backgroundSize: "cover"
//       }}/>
//     </Styled.LogoWrap>
//   </Styled.LoginHead>
// })


import React, {useEffect, useState} from "react";
import {LoginStyles as Styled} from "./styles";
import {SignUp, SignIn, WalletSignIn} from "./components";
import {useAuth} from "@/usehooks/useAuth";
import {
  updateBoxes, updateOwnerStore,
  updateProfileStore,
  useOwnerStore,
  useProfileStore,
} from "@/redux";
import {useParams} from "react-router-dom";
import {DataBoxApi, MBApi, ProfileApi, RequestApi} from "@/api";
import {get_principal, timer} from "@/utils/common";
import {useTranslation} from "react-i18next";
import {CacheApi, PrincipalNotFound, PrivateKeyNotFound, PROFILENotFound, PubKeyNotFound} from "@/api/cache";
import {useCache} from "@/usehooks/useCache";

function Login() {
  const {user}: { user: string | undefined } = useParams()
  const {principal, isAuth} = useAuth();
  const {profileID, publicKey} = useCache()
  const [isReset, setIsReset] = useState(false)
  const {user_principal} = useOwnerStore()
  const {pre_private_key} = useProfileStore()
  const {t} = useTranslation()

  const Compared = React.useCallback(async () => {
    try {
      if (principal && !principal.isAnonymous()) {
        if (user) {
          const user_principal = await get_principal(user)
          updateOwnerStore({isOwner: String(principal) === String(user_principal), user_principal})
        } else updateOwnerStore({isOwner: true, user_principal: principal})
      }
    } catch (e) {
      String(e) === PrincipalNotFound && timer(t("toast.no_user"), 0)
    }
  }, [principal])


  const getPrivateKey = async () => {
    if (profileID === PROFILENotFound) throw new Error("用户不存在")
    const profileApi = ProfileApi(profileID)
    profileApi.auto_upgrade().then(e => e !== "no need" && e !== "ok" && location.reload())
    const re = await profileApi.getEncryptedSecretKey()
    if ("ok" in re) updateProfileStore({pre_private_key: re.ok[0]})
    else updateProfileStore({pre_private_key: PrivateKeyNotFound})
  }


  const turn_email = () => {
    if (!user_principal || !principal) return 0
    if (user_principal.toString() === principal.toString()) {
      RequestApi.get_recent_download(user_principal)
      setInterval(() => {
        RequestApi.getUnHandle(user_principal)
        RequestApi.get_share_response(user_principal)
      }, 10000)
    }
  }

  const get_user_profile_info = async () => {
    if (!user_principal) return
    let user_profile: string
    try {
      user_profile = await CacheApi.get_profile(user_principal)
      if (user_profile === PROFILENotFound) user_profile = String(await MBApi.getProfile(user_principal))
    } catch (e) {
      const profileID = await MBApi.getProfile(user_principal)
      user_profile = profileID ? profileID.toString() : PROFILENotFound
    }
    if (user_profile === PROFILENotFound) throw new Error("用户不存在")
    const user_profileApi = ProfileApi(user_profile)
    user_profileApi.updateProfileInfo().then()
    user_profileApi.getLinks().then()
    const upgrade_res = await user_profileApi.auto_upgrade()
    if (upgrade_res !== "ok" && upgrade_res !== "no need") timer(t("toast.not_upgrade"), 5000)
    updateBoxes({profile: user_profile === "undefined" ? "" : user_profile})
  }

  const fetchData = () => {
    MBApi.getBoxes(user_principal).then(data_box_arr => {
      try {
        if (String(user_principal) === String(principal)) {
          const allPromise: Promise<void>[] = []
          data_box_arr.forEach(data_box => {
            const api = DataBoxApi(data_box)
            allPromise.push(api.clearBuffer())
          })
          Promise.all(allPromise).then()
        }
      } catch (e) {
        throw e
      }
    });
  };

  useEffect(() => {
    isAuth && profileID && getPrivateKey()
  }, [isAuth, profileID])

  useEffect(() => {
    Compared()
  }, [Compared])

  useEffect(() => {
    // user_principal && principal && turn_email()
  }, [user_principal, principal])

  useEffect(() => {
    if (isAuth && user_principal) {
      get_user_profile_info()
      fetchData()
    }
  }, [user_principal, isAuth])

  return (
    <Styled.Background>
      <Logo/>
      {!isAuth ? <WalletSignIn/>
        : profileID === PROFILENotFound || publicKey === PubKeyNotFound ? <SignUp isReset={isReset}/>
          : pre_private_key === "" ? <LoadingImg/> : pre_private_key !== PrivateKeyNotFound && !isReset ?
            <SignIn setIsReset={setIsReset}/>
            : <SignUp isReset={isReset}/>
      }
    </Styled.Background>
  );
}

export default Login;

export const LoadingImg = React.memo(() => {
  return <Styled.LoadingImg>
    <Styled.LoadingItemWhite/>
    <Styled.LoadingItemBlue/>
  </Styled.LoadingImg>
})

const Logo = React.memo(() => {
  return <Styled.LoginHead>
    <Styled.LogoWrap>
      <Styled.Logo/>
      <div style={{width: '2rem'}}/>
      <div style={{
        background: "url(./metabox.jpg) no-repeat center center",
        height: "4.5rem",
        width: "25rem",
        backgroundSize: "cover"
      }}/>
    </Styled.LogoWrap>
  </Styled.LoginHead>
})
