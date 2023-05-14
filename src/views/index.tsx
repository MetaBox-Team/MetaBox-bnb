import React, {useEffect} from "react";
import "antd/dist/antd.css";
import {Wrap} from "./styles";
import {Route, Switch} from "react-router-dom";
import {Props as props, useAuth} from "@/usehooks/useAuth";
import {Profile} from "./Profile";
import Login from "@/views/Login";
import {Side} from "@/views/Sider";
import {DataPanel} from "@/views/DataPanel";
import {Following} from "@/views/Profile/components";
import {DataBox} from "./DataBox_2"
import {NotFound} from "@/views/404";
import {updateBoxes, useKeyStore} from "@/redux";
import {Follower} from "@/views/Profile/components/Follower";
import {Deposit} from "@/views/Deposit";
import {LedgerApi, MBApi, RequestApi, RSAEncryptApi} from "@/api";
import {toast} from "react-toastify";
import {ethers} from "ethers";
import {Principal} from "@dfinity/principal";
import {sign_metamask} from "../../agent-js-0.13.1/packages/auth-client/src";

declare global {
  interface Window {
    ic: any;
    ethereum: any,
  }
}

export default () => {
  const {isAuth, logOut, identity} = useAuth();
  // const detection = () => {
  //   if (!window.ethereum) return toast.warning("please install MetaMask wallet first")
  //   window.ethereum.on('accountsChanged', () => {
  //     logOut?.()
  //   });
  // }
  useEffect(() => {
    MBApi.getDataBoxVersion().then(e => updateBoxes({data_box_new_version: e}))
  }, [])


  useEffect(() => {
    isAuth && Query()
  }, [isAuth])


  const test = async () => {
    if (!identity) return
    // const userKey = (identity.getDelegation().toJSON().publicKey)
    // const {sig} = await sign_metamask(userKey)
  }

  useEffect(() => {
    identity && test()
  }, [identity])

  const Query = async () => {
    LedgerApi.account_balance().then()
    MBApi.isFirstDataBox().then()
    MBApi.getICP().then()
  }


  return (
    <Switch>
      <Wrap>
        <Switch>
          <Route exact path="/" render={() => <Login/>}/>
          <Route exact path="/:user" render={() => <Content> <DataPanel/> </Content>}/>
          <Route exact path="/datapanel/:user" render={() => <Content><DataPanel/></Content>}/>
          <Route exact path="/databox/:canister_id/:user/:id" render={() => <Content><DataBox/></Content>}/>
          <Route exact path="/profile/:user" render={() => <Content><Profile/></Content>}/>
          <Route exact path="/following/:user" render={() => <Content><Following/></Content>}/>
          <Route exact path="/follower/:user" render={() => <Content><Follower/></Content>}/>
          <Route exact path="/deposit/:user" render={() => <Content><Deposit/></Content>}/>
          <Route exact path="*" render={() => <NotFound/>}/>
        </Switch>
      </Wrap>
    </Switch>
  )
}

const Content = React.memo(({children}: { children }) => {
  const {isAuth}: props = useAuth();
  const {privateKey} = useKeyStore()

  return <>{isAuth && privateKey ? <><Side/>{children}</> : <Login/>}</>
})
