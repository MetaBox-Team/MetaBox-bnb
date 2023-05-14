import {useAuth} from "@/usehooks/useAuth";
import React from "react";
import {WalletSigInStyles as Styled} from "./styles";
import {toast_api} from "@/utils/T";

export const WalletSignIn = React.memo(() => {
  const {logIn, plugLogIn} = useAuth()

  return (
    <Styled.Center>
      <Pure/>
      <div style={{display: "flex", justifyItems: "center", flex: "1", flexWrap: "wrap", gap: "3.3rem"}}>
        <II logIn={logIn}/>
        <MetaMask logIn={logIn}/>
        {/*<Arweave logIn={logIn}/>*/}
      </div>
    </Styled.Center>
  );
})

const Pure = React.memo(() => <div style={{display: "flex", justifyItems: "center", alignItems: "left", width: "100%"}}>
  <Styled.HeaderTip>Select Wallet</Styled.HeaderTip>
</div>)

const II = React.memo(({logIn}: { logIn?: Function }) => {

  const handleClick = () => {
    logIn?.("II")
  }

  return <Styled.WalletBox onClick={handleClick}>
    <Styled.WalletIcon
      url={"https://global.discourse-cdn.com/business4/uploads/dfn/optimized/1X/c6f5dd4f7a21c825f82566b7c7528e5505734f77_2_180x180.png"}>
    </Styled.WalletIcon>
    <Styled.WalletName>Internet Identity</Styled.WalletName>
  </Styled.WalletBox>
})

const MetaMask = React.memo(({logIn}: { logIn?: Function }) => {

  const handleClick = () => {
    toast_api(logIn?.("MetaMask"), "metamask", "login").then()
  }

  return <Styled.WalletBox onClick={handleClick}>
    <Styled.WalletIcon
      url={"./metamask.svg"}>
    </Styled.WalletIcon>
    <Styled.WalletName>MetaMask</Styled.WalletName>
  </Styled.WalletBox>
})

const Arweave = React.memo(({logIn}: { logIn?: Function }) => {

  const handleClick = () => {
    toast_api(logIn?.("Arconnect"), "arweave", "login").then()
  }
  return <Styled.WalletBox onClick={handleClick}>
    <Styled.WalletIcon url={"./arconnect.jpg"}>
    </Styled.WalletIcon>
    <Styled.WalletName>Arconnect</Styled.WalletName>
  </Styled.WalletBox>
})

