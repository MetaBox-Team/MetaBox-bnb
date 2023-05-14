import {Modal} from 'antd';
import {CheckBalanceStyles as Styled} from "./styles";
import React, {ReactText, useEffect, useRef, useState} from 'react';
import "./index.css";
import {Avatar, CopyTip, Gap, Refresh, SelectInput, SelectWallet} from "@/components";
import {CreateBoxByEthArgs, EVMNet, LedgerApi, MBApi, RequestApi} from "@/api";
import {updateBoxes, useBalanceStore, useBoxesStore} from "@/redux";
import {useAuth} from "@/usehooks/useAuth";
import Spin from "antd/es/spin"
import {desensitizationPrincipal} from "@/utils/formate";
import Button from "antd/es/button";
import {go_to_error, toast_api} from "@/utils/T";
import {checkTxStatusWrap, get_eth_address, sleep, TransferUSDT} from "@/utils/common";
import {Item1, Item2} from "../BoxModal/View";
import {useTranslation} from "react-i18next";
import {toast} from 'react-toastify';
import {change_chain} from "@/utils/walletEvent";
import {ethers} from "ethers";
import {MetaMaskToken} from "@/views/Deposit";
import {BEP20ABI, ERC20ABI} from "@/config";
import {sign_metamask} from "../../../../agent-js-0.13.1/packages/auth-client/src";


type TOKEN = "ICP" | "ETH" | "USDT" | "BNB"
export type WALLET = "Arconnect" | "MetaMask"
export const info = {
  "Ethereum Mainnet": "0x1",
  "Arbitrum": "0xa4b1",
  "BSC": "0x38",
  "Polygon": "0x89",
}

const bsc_eth: MetaMaskToken = {
  symbol: "ETH",
  address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  decimals: 18
}


export const USDT: Record<string, MetaMaskToken> = {
  "Ethereum Mainnet": {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6
  },
  "Arbitrum": {
    symbol: "USDT",
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    decimals: 6
  },
  "Polygon": {
    symbol: "USDT",
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    decimals: 6
  },
  "BSC": {
    symbol: "USDT",
    address: "0x55d398326f99059fF775485246999027B3197955",
    decimals: 18
  }
}

export const CheckBalanceModal = React.memo(({
                                               open,
                                               setOpen,
                                               needICP
                                             }: { open: boolean, setOpen: Function, needICP: number }) => {
  const balance = useBalanceStore()
  const {identity} = useAuth()
  const [isErr, setIsErr] = useState(false)
  const [token, setToken] = useState<TOKEN>("ETH")
  const [wallet, setWallet] = useState<WALLET>("MetaMask")
  const [network, setNetwork] = useState<EVMNet>("Ethereum Mainnet")
  const [name, setName] = useState("")
  const [isPrivate, setIsPrivate] = useState(true)
  const [text, setText] = useState("")
  const inputRef1 = useRef(null)
  const {principal} = useAuth()
  const {isFirstDataBox} = useBoxesStore()
  const {t} = useTranslation()


  const networkArray = React.useMemo(() => {
    const base = ["Ethereum Mainnet", "Arbitrum"]
    if (token === "ETH") return base
    if (token === "BNB") return ["BSC"]
    return [...base, "Polygon", "BSC"]
  }, [token])

  const checkNetwork = async () => {
    await change_chain(info[network])
  }


  const T = React.useCallback((a: string) => t(`Modal.CreateBoxModal.${a}`), [t])

  const arg = React.useMemo(() => {
    return {
      'is_private': isPrivate,
      'box_name': name,
      'box_type': {data_box: null}
    }
  }, [name, isPrivate])

  const transferBscEth = (value: number) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const tokenInst = new ethers.Contract(bsc_eth.address, BEP20ABI, signer)
        const amount = ethers.utils.parseUnits(value.toFixed(5), bsc_eth.decimals)
        const res = await tokenInst.transfer(process.env.ETH_ADDRESS, amount)
        const hash = res.hash
        return resolve(hash)
      } catch (e) {
        reject(e)
      }
    })
  }

  const transferErc20ETH = (value: number) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: process.env.ETH_ADDRESS, // Required except during contract publications.
          from: accounts[0], // must match user's active address.
          value: ethers.utils.parseUnits(value + "", 18).toHexString(), // Only required to send ether to the recipient from the initiating external account.
          chainId: info[network]  //"0xaa36a7", // sepolia testnet.
        };
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
        return resolve(txHash)
      } catch (e) {
        reject(e)
      }
    })
  }

  const transfer = async (value: number): Promise<{ tx_hash: string, toastID: React.ReactText }> => {
    try {
      let txHash: string = ""
      const isBSC = network === "BSC"
      if (isBSC) {
        txHash = await transferBscEth(value)
      } else {
        txHash = await transferErc20ETH(value)
      }
      const toastId = toast.loading(`🦄 query transaction status...`, {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: false
      })
      return await checkTxStatusWrap(txHash, toastId)
    } catch (e) {
      throw e
    }
  }

  const createByICP = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await MBApi.createBoxFee(arg, true)
        if (!!res) return resolve("ok")
      } catch (e) {
        reject(e)
      }
    })
  }

  const createByETH = () => {
    return new Promise(async (resolve, reject) => {
      let toastId: React.ReactText = 0
      try {
        const publicKey = identity?.getDelegation().toJSON().publicKey
        if (!publicKey) return reject("user key is undefined")
        await checkNetwork()
        const {sig} = await sign_metamask(publicKey)
        const address = await get_eth_address()
        const needETH = await getEHTICPSymbol()
        const res = await transfer(needETH)
        const {tx_hash} = res
        toastId = res.toastID
        const args: CreateBoxByEthArgs = {
          net: network,
          from: address.slice(2),
          tx_hash: tx_hash.slice(2),
          args: {'metadata': {...arg, box_type: "data_box"}},
          user_key: publicKey,
          sig
        }
        if (tx_hash) {
          toast.update(toastId, {render: `🦄 creating box ...`})
          const res = await RequestApi.createBoxByOtherToken("eth", args)
          if (!!res) {
            toast.update(toastId, {render: `🦄 creating box successfully`})
            MBApi.getBoxes(principal).then()
            return resolve("ok")
          }
        }
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

  const createForFree = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await MBApi.createBox(arg)
        if (!!res) return resolve("ok")
      } catch (e) {
        reject(e)
      }
    })
  }

  const queryUSDTBinance = async () => {
    const endpoint = "https://data.binance.com/api/v3"
    const url = `${endpoint}/ticker/price?symbol=ICPUSDT`
    const res = await fetch(url)
    const json_res = await res.json()
    const ICP_Price = json_res.price
    return needICP * ICP_Price
  }

  const getBNBICPSymbol = async () => {
    try {
      const need_bnb = await RequestApi.get_cost("bnb")
      if (need_bnb !== -1) return +ethers.utils.formatUnits(need_bnb, 18)
      throw new Error("server error")
    } catch (e) {
      throw new Error("server error")
    }
  }

  const getUSDTICPSymbol = async () => {
    try {
      const need_usdt = await RequestApi.get_cost("usdt")
      if (need_usdt !== -1) return +ethers.utils.formatUnits(need_usdt, 6)
      return await queryUSDTBinance()
    } catch (e) {
      return await queryUSDTBinance()
    }
  }

  const transferUSDT = (value: number) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const hash = await TransferUSDT(value, network)
        return resolve(hash)
      } catch (e) {
        reject(e)
      }
    })
  }


  const createByUSDT = () => {
    return new Promise(async (resolve, reject) => {
      let toastId = toast.loading(`waiting`, {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: false
      })
      try {
        const publicKey = identity?.getDelegation().toJSON().publicKey
        if (!publicKey) return reject("user key is undefined")
        const address = await get_eth_address()
        await checkNetwork()
        const needUSDT: number = await getUSDTICPSymbol()
        const txHash: string = await transferUSDT(needUSDT)
        const {sig} = await sign_metamask(publicKey)
        toast.update(toastId, {render: `🦄 query transaction status...`})
        const {tx_hash} = await checkTxStatusWrap(txHash, toastId)

        const args: CreateBoxByEthArgs = {
          net: network,
          from: address.slice(2),
          tx_hash: tx_hash.slice(2),
          args: {'metadata': {...arg, box_type: "data_box"}},
          user_key: publicKey,
          sig
        }
        if (tx_hash) {
          toast.update(toastId, {render: `🦄 creating box ...`})
          const res = await RequestApi.createBoxByOtherToken("usdt", args)
          if (!!res) {
            toast.update(toastId, {render: `🦄 creating box successfully`})
            MBApi.getBoxes(principal).then()
            return resolve("ok")
          }
        }
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

  const transferBNB = async (value: number) => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const toAddress = process.env.ETH_ADDRESS;
    const transactionData = {
      to: toAddress,
      value: ethers.utils.parseEther(value + ""),
    };
    const transactionResponse = await signer.sendTransaction(transactionData);
    const {hash} = transactionResponse;
    return hash
  }

  const createByBNB = async () => {
    return new Promise(async (resolve, reject) => {
      let toastId: React.ReactText = 0
      try {
        const publicKey = identity?.getDelegation().toJSON().publicKey
        if (!publicKey) return reject("user key is undefined")
        await checkNetwork()
        const {sig} = await sign_metamask(publicKey)
        const address = await get_eth_address()
        const needBNB = await getBNBICPSymbol()
        const txHash = await transferBNB(needBNB)
        toastId = toast.loading(`🦄 query transaction status...`, {
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: false
        })
        const {tx_hash} = await checkTxStatusWrap(txHash, toastId)
        const args: CreateBoxByEthArgs = {
          net: network,
          from: address.slice(2),
          tx_hash: tx_hash.slice(2),
          args: {'metadata': {...arg, box_type: "data_box"}},
          user_key: publicKey,
          sig
        }
        if (tx_hash) {
          toast.update(toastId, {render: `🦄 creating box ...`})
          const res = await RequestApi.createBoxByOtherToken("bnb", args)
          if (!!res) {
            toast.update(toastId, {render: `🦄 creating box successfully`})
            MBApi.getBoxes(principal).then()
            return resolve("ok")
          }
        }
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
    let func: Promise<any> | undefined = undefined
    if (!isFirstDataBox) {
      func = createForFree()
    } else if (token === "ICP") {
      if (is_enough()) func = createByICP()
      else return
    } else if (token === "ETH") {
      createByETH().then()
    } else if (token === "USDT") {
      createByUSDT()
    } else if (token === "BNB") {
      createByBNB()
    }
    clear()
    if (!!func) {
      toast_api(func, name, "create").then(() => {
        MBApi.getBoxes(principal).then()
        updateBoxes({isFirstDataBox: true}).then()
        LedgerApi.account_balance().then()
      })
    }
  }

  const is_enough = () => {
    const is_enough = balance >= needICP
    if (!is_enough) setIsErr(true)
    return is_enough
  }

  const clear = React.useCallback(() => {
    setName("")
    setIsPrivate(true)
    //@ts-ignore
    if (inputRef1.current) inputRef1.current.value = '';
    setOpen(false)
    setIsErr(false)
  }, [])

  useEffect(() => {
    open && handleRefresh().then()
  }, [open])

  useEffect(() => {
    setNetwork(token === "BNB" ? "BSC" : "Ethereum Mainnet")
    setIsErr(false)
  }, [token])

  const handleRefresh = React.useCallback(async () => {
    await LedgerApi.account_balance()
  }, [])

  const queryBinance = async () => {
    const endpoint = "https://data.binance.com/api/v3"
    const url = `${endpoint}/ticker/price?symbols=%5B%22ETHUSDT%22,%22ICPUSDT%22%5D`
    const res = await fetch(url)
    const json_res = await res.json()
    const ICPPrice = json_res[1].price
    const ETHPrice = json_res[0].price
    const ICPETH = ICPPrice / ETHPrice
    return needICP * ICPETH
  }

  const getEHTICPSymbol = async (): Promise<number> => {
    try {
      const need_eth = await RequestApi.get_cost("eth")
      if (need_eth !== -1) return +ethers.utils.formatUnits(need_eth, 18)
      return await queryBinance()
    } catch (e) {
      return await queryBinance()
    }
  }

  const getText = async () => {
    if (token === "ICP") {
      setText(needICP + "ICP")
    } else if (token === "ETH") {
      getEHTICPSymbol().then(e => setText(e.toFixed(6) + "ETH"))
    } else if (token === "USDT") {
      getUSDTICPSymbol().then(e => setText(e.toFixed(3) + "USDT"))
    } else if (token === "BNB") {
      getBNBICPSymbol().then(e => setText(e.toFixed(6) + "BNB"))
    }
  }

  useEffect(() => {
    getText()
  }, [needICP, token])

  return (
    <>
      <Modal
        maskClosable={false}
        key={'TopUpModal'}
        wrapClassName={'TopUpModal'}
        title={
          [<div style={{color: '#4E4597', textAlign: 'center', fontSize: 25}}
                key={"SharedModalTitle"}>Create Box</div>]
        }
        width={"60rem"}
        footer={
          [
            <div key={"SharedModalFooter"} style={{textAlign: 'center'}}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: '20%'
              }}>
                <Button onClick={clear} style={{
                  gap: '1.0rem',
                  color: 'white',
                  background: "grey",
                  borderRadius: '1.0rem',
                  height: '4.5rem',
                  marginRight: '2.0rem',
                  marginLeft: '2.0rem',
                  padding: "0 2rem"
                }}>
                  Close
                </Button>
                <Button onClick={handleConfirm} style={{
                  gap: '1.0rem',
                  color: 'white',
                  background: "#4E4597",
                  borderRadius: '1.0rem',
                  height: '4.5rem',
                  marginRight: '2.0rem',
                  marginLeft: '2.0rem',
                  padding: "0 2rem"
                }}>
                  Create
                </Button>
              </div>
            </div>
          ]
        }
        open={open}
        closable={false}>
        <Spin spinning={!needICP}>
          <Item1 T={T} setName={setName} inputRef1={inputRef1}/>
          <Item2 T={T} isPrivate={isPrivate} setPrivate={setIsPrivate}/>
          <Styled.BodySelector style={{display: isFirstDataBox ? 'flex' : "none"}} className={'creatBox2Selector'}>
            <Styled.ConfigText>Token</Styled.ConfigText>
            <SelectToken item={token} setItem={setToken}/>
            {
              token !== "ICP" &&
              <>
                <Gap height={20}/>
                <Styled.ConfigText>Wallet</Styled.ConfigText>
                <SelectWallet wallet_arr={["MetaMask"]} item={wallet} setItem={setWallet}/>
                <Gap height={20}/>
                <Styled.ConfigText>Network</Styled.ConfigText>
                <SelectWallet wallet_arr={networkArray} item={network}
                              setItem={setNetwork}/>
                {/*<Gap height={20}/>*/}
                {/*<Styled.ConfigText>Deposit</Styled.ConfigText>*/}
                {/*<EthToCycleInputWrap/>*/}
              </>
            }
            <Gap height={20}/>
            <Item_1 text={text}/>
            <Gap height={20}/>
            {/*{token === "ICP" && <Item_2 subAccountId={subAccountId}/>}*/}
            <Balance isErr={isErr} type={token} balance={balance} handleRefresh={handleRefresh}/>
          </Styled.BodySelector>
        </Spin>
      </Modal>
    </>
  );
})

const EthToCycleInputWrap = React.memo((props: {}) => {
  return <Styled.Input>
    <Styled.InputText placeholder={""}
    />
  </Styled.Input>
})

const Item_1 = React.memo((props: { text: string }) => {

  return <Styled.ConfigText>
    Need:&nbsp;
    <Styled.ConfigText style={{fontSize: "1rem", color: '#4E4597'}}>
      {props.text}
    </Styled.ConfigText>
  </Styled.ConfigText>
})

const SelectToken = React.memo((props: { item: string, setItem: Function }) => {
  const symbols = ["ETH", "USDT", "ICP", "BNB"]
  return <SelectInput
    itemComponent=
      {
        symbols.map((v, k) => {
          return ItemComponent({setItem: props.setItem, v: v, k: k})
        })
      }
    {...props} />
})

const ItemComponent = (props: { setItem: Function, v: string, k: number }) => {
  const {v, setItem} = props
  return (setIsShow: Function) => {
    return <Styled.DropdownItem key={props.k} onClick={() => {
      setItem(v)
      setIsShow(false)
    }}>
      <div style={{color: "#787878", fontSize: "2.5rem"}}>{v}</div>
    </Styled.DropdownItem>
  }
}

const Balance = React.memo((props: { type: TOKEN, balance: number, handleRefresh: Function, isErr: boolean }) => {
  const {type, balance, handleRefresh, isErr} = props
  return <>
    <Styled.BalanceWrapper style={{display: type === "ICP" ? "flex" : "none"}}>
      Your Balance : &nbsp;<Styled.Balance>{balance}</Styled.Balance>&nbsp;&nbsp;
      <Refresh height={1.6} width={1.6} handleRefresh={handleRefresh}/>
    </Styled.BalanceWrapper>
    <Styled.BalanceWrapper style={{color: "red", display: isErr ? "flex" : "none"}}>
      Insufficient balance
    </Styled.BalanceWrapper>
  </>
})

const Avatar_1 = React.memo(({url}: { url: string }) =>
  <Styled.AvatarWrap>
    <Avatar url={url} width={"8.6rem"} height={"8.6rem"}/>
  </Styled.AvatarWrap>)

const Item_2 = React.memo((props: { subAccountId?: string }) => {
  const {subAccountId} = props
  return <>
    <Styled.ConfigText>
      account&nbsp;
      <Styled.ConfigText style={{fontSize: "1rem", color: '#4E4597'}}>
        {`Please recharge enough icp to this account`}
      </Styled.ConfigText>
    </Styled.ConfigText>
    <Styled.ConfigText style={{color: "#4E4597"}}>
      {subAccountId && desensitizationPrincipal(subAccountId, 15)}&nbsp;
      <CopyTip content={subAccountId}/>
    </Styled.ConfigText>
    <Gap height={20}/>
  </>
})


