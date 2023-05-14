import {Modal} from 'antd';
import {LoginStyles as Styled} from "./styles";
import React, {useCallback, useEffect, useRef, useState} from 'react';
import "./index.css";
import {Avatar, CopyTip, Gap, info, Refresh, SelectWallet, USDT, WALLET} from "@/components";
import {BoxAllInfo} from "@/did/model/MBox";
import {EVMNet, EVMTopUpArgs, LedgerApi, MBApi, RequestApi, XTCApi} from "@/api";
import {BurnArgs} from "@/did/model/XTC";
import {useBalanceStore, useOwnerStore} from "@/redux";
import {desensitizationPrincipal} from "@/utils/formate";
import {go_to_error, toast_api} from "@/utils/T";
import {useTranslation} from "react-i18next";
import {Footer} from "@/components/Modals/components";
import {checkTxStatusWrap, get_eth_address, sleep, TransferUSDT} from "@/utils/common";
import {sign_metamask} from "../../../../agent-js-0.13.1/packages/auth-client/src";
import {change_chain} from "@/utils/walletEvent";
import {ethers} from "ethers";
import {toast} from "react-toastify";


type token = "ICP" | "XTC" | "USDT"


export const TopUpModal = React.memo(({
                                        open,
                                        setOpen,
                                        boxItem,
                                      }: { open: boolean, setOpen: Function, boxItem?: BoxAllInfo }) => {
  const [isError, setIsError] = useState(false)
  const [errorText, setErrorText] = useState("")
  const [type, setType] = useState<token>("USDT")
  const [url, setUrl] = useState("")
  const [amount, setAmount] = useState(0)
  const {user_principal} = useOwnerStore()
  const inputRef2 = useRef(null)
  const balance = useBalanceStore()
  const [network, setNetwork] = useState<EVMNet>("Ethereum Mainnet")
  const {t} = useTranslation()
  const [wallet, setWallet] = useState<WALLET>("MetaMask")


  useEffect(() => {
    if (boxItem) {
      const url_1 = `https://${boxItem.canister_id.toString()}.raw.ic0.app/avatar/${boxItem.avatar_key}`
      fetch(url_1).then(e => {
        if (boxItem.avatar_key && e.ok) setUrl(url_1)
        else setUrl("")
      })
    }
  }, [boxItem])

  const T = useCallback((a: string) => t(`Modal.TopUpModal.${a}`), [t])

  useEffect(() => {
    setIsError(false)
  }, [amount])

  useEffect(() => {
    open && handleCancel()
  }, [open])

  useEffect(() => {
    handleCancel()
  }, [type])

  const clean = () => {
    setIsError(false)
    setAmount(0)
    //@ts-ignore
    if (inputRef2.current) inputRef2.current.value = '';
  }

  const handleCancel = useCallback(() => {
    clean()
  }, [])

  const setError = (text: string) => {
    setIsError(true)
    setErrorText(text)
  }

  const checkNetwork = async () => {
    await change_chain(info[network])
  }

  const topUpUseUSDT = () => {
    return new Promise(async (resolve, reject) => {
      let toastId: React.ReactText = 0
      try {
        await checkNetwork()
        const address = await get_eth_address()
        const formatAmount: string = ethers.utils.parseUnits(amount + "", USDT[network].decimals).toString()
        const principal: string = boxItem ? boxItem.canister_id.toString() : ""
        const message = `${formatAmount}${principal}`
        const {sig} = await sign_metamask(message)
        const txHash = await TransferUSDT(amount, network)
        toastId = toast.loading(`🦄 query transaction status...`, {
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: false
        })
        const {tx_hash} = await checkTxStatusWrap(txHash, toastId)
        const args: EVMTopUpArgs = {
          net: network,
          from: address.slice(2),
          amount: formatAmount,
          tx_hash: tx_hash.slice(2),
          principal,
          sig
        }
        if (tx_hash) {
          toast.update(toastId, {render: `🦄 topup box ...`})
          const res = await RequestApi.topUp(args)
          if (res === "ok") {
            toast.update(toastId, {render: `🦄 topup box successfully`})
            return resolve("ok")
          } else throw new Error("top up failed")
        } else throw new Error("tx error")
      } catch (e: any) {
        if (toastId) go_to_error(toastId, e.message ? e.message : String(e))
        else toast.error(e.message ? e.message : String(e))
        reject(e)
      } finally {
        await sleep(3000)
        toast.dismiss(toastId)
      }
    })
  }

  const handleConfirm = async () => {
    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0")
    } else {
      if (boxItem) {
        if (type === "XTC") {
          const arg: BurnArgs = {
            'canister_id': boxItem.canister_id,
            'amount': BigInt(Number(amount) * 1e12)
          }
          toast_api(XTCApi.burn(arg), boxItem.box_name, "top_up").then(() => MBApi.getBoxes(user_principal))
          setOpen(false)
        } else if (type === "ICP") {
          if (Number(amount) <= 0.02) {
            setError("The amount needs to be greater than 0.02")
          } else if (balance < amount) {
            setError("Insufficient balance")
          } else {
            toast_api(MBApi.topUpCanister(Number(amount), boxItem.canister_id), boxItem.box_name, "top_up").then(() => MBApi.getBoxes(user_principal))
            setOpen(false)
          }
        } else if (type === "USDT") {
          topUpUseUSDT().then(() => MBApi.getBoxes(user_principal))
          setOpen(false)
        }
      }
    }
  }


  const handleRefresh = React.useCallback(async () => {
    await LedgerApi.account_balance()
  }, [])

  const close = React.useCallback(() => setOpen(false), [])

  return (
    <>
      <Modal
        maskClosable={false}
        key={'TopUpModal'}
        wrapClassName={'TopUpModal'}
        title={
          [<div style={{color: '#4E4597', textAlign: 'center', fontSize: 25}}
                key={"SharedModalTitle"}>{T("title")}</div>]
        }
        width={"70rem"}

        footer={
          [
            <Footer key={"SharedModalFooter"} clear={close} handleClick={handleConfirm}/>
          ]
        }
        open={open}
        closable={false}>
        <Styled.Body>
          <Avatar_1 url={url}/>
          <Styled.BodySelector className={'creatBox2Selector'}>
            <Styled.ConfigText>{T("token")}</Styled.ConfigText>
            <Item_1 type={type} setType={setType}/>
            <Gap height={20}/>
            {/*<Item_2 T={T} type={type} subAccountId={subAccountId}/>*/}
            {type === "USDT" && <>
              <SelectTopUpWallet wallet={wallet} setWallet={setWallet}/>
              <Gap height={20}/>
              <SelectTopUpNetwork setNetwork={setNetwork} network={network}/>
              <Gap height={20}/>
            </>}
            <Styled.ConfigText>
              {T("amount")}({type === "ICP" ? "ICP" : type === "XTC" ? "XTC" : "USDT"})
            </Styled.ConfigText>
            <Item_3 type={type} inputRef2={inputRef2} errorText={errorText} isError={isError} setAmount={setAmount}/>
            <Balance type={type} balance={balance} handleRefresh={handleRefresh} T={T}/>
          </Styled.BodySelector>
        </Styled.Body>
      </Modal>
    </>
  );
})

const Balance = React.memo((props: { type: token, balance: number, handleRefresh: Function, T: Function }) => {
  const {type, balance, handleRefresh, T} = props
  return <Styled.BalanceWrapper style={{display: type === "ICP" ? "flex" : "none"}}>
    {T("balance")} : &nbsp;<Styled.Balance>{balance}</Styled.Balance>&nbsp;&nbsp;
    <Refresh height={1.6} width={1.6} handleRefresh={handleRefresh}/>
  </Styled.BalanceWrapper>
})

const Avatar_1 = React.memo(({url}: { url: string }) =>
  <Styled.AvatarWrap>
    <Avatar url={url} width={"8.6rem"} height={"8.6rem"}/>
  </Styled.AvatarWrap>)

const Item_1 = React.memo((props: { type: token, setType: Function }) => {
  const {type, setType} = props;
  return <Styled.Radio>
    <Styled.RadioItem isClick={type === "USDT"} style={{borderRadius: ".6rem 0 0 .6rem"}}
                      onClick={() => {
                        setType('USDT')
                      }}>USDT</Styled.RadioItem>
    <Styled.RadioItem isClick={type === "ICP"}
                      onClick={() => {
                        setType('ICP')
                      }}>ICP</Styled.RadioItem>
    <Styled.RadioItem isClick={type === "XTC"} style={{borderRadius: "0 .6rem .6rem .0rem"}}
                      onClick={() => {
                        setType('XTC')
                      }}>XTC</Styled.RadioItem>
  </Styled.Radio>
})

const SelectTopUpNetwork = React.memo((props: { network: EVMNet, setNetwork: Function }) => {
  return <>
    <Styled.ConfigText>Network</Styled.ConfigText>
    <SelectWallet wallet_arr={["Ethereum Mainnet", "Polygon", "Arbitrum", "BSC"]} item={props.network}
                  setItem={props.setNetwork}/>
  </>
})

const SelectTopUpWallet = React.memo((props: { wallet: WALLET, setWallet: Function }) => {
  return <>
    <Styled.ConfigText>Wallet</Styled.ConfigText>
    <SelectWallet wallet_arr={["MetaMask"]} item={props.wallet} setItem={props.setWallet}/>
  </>
})

const Item_2 = React.memo((props: { T: Function, type: token, subAccountId?: string }) => {
  const {T, type, subAccountId} = props
  return <>
    {type === "ICP" && <>
      <Styled.ConfigText>
        {T("account")}&nbsp;
        <Styled.ConfigText style={{fontSize: "1rem", color: '#4E4597'}}>
          ({T("tip")})
        </Styled.ConfigText>
      </Styled.ConfigText>
      <Styled.ConfigText style={{color: "#4E4597"}}>
        {subAccountId && desensitizationPrincipal(subAccountId, 15)}&nbsp;
        <CopyTip content={subAccountId}/>
      </Styled.ConfigText>
      <Gap height={20}/>
    </>}
  </>
})

const Item_3 = React.memo((props: { isError: boolean, inputRef2, setAmount: Function, type: token, errorText: string }) => {
  return <Styled.Input>
    <Item_3_input {...props}/>
    <Item_3_text {...props}/>
  </Styled.Input>
})

const Item_3_input = React.memo((props: { inputRef2, setAmount: Function, type: token }) => {
  const {inputRef2, setAmount, type} = props
  return <Styled.InputText type={"number"} min={0} ref={inputRef2}
                           onChange={(e) => setAmount(Number(e.target.value))}
                           placeholder={type === "XTC" ? "1 XTC = 1T Cycles" : type === "ICP" ? "1ICP ≈ 4T Cycles" : "1.35 USDT ≈ 1T Cycles"}/>
})
const Item_3_text = React.memo((props: { isError: boolean, errorText: string }) => {
  const {isError, errorText} = props
  return <Styled.ErrorText style={{display: isError ? "flex" : "none"}}>{errorText}</Styled.ErrorText>

})
