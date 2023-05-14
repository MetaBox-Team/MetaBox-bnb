import React, {useEffect, useState} from 'react';
import {DepositStyles as Styled} from "./styles"
import {Box} from "@/styles";
import Icon from "@/icons/Icon";
import {ethers} from "ethers";
import Everpay from "everpay";
import {ArweaveTransaction, ChainType, EthereumTransaction, SendEverpayTxResult} from "everpay/cjs/types";
import {buildUpEverPayToken, get_eth_address, inquireWithdrawEverpayTx, sleep} from "@/utils/common";
import {useAuth} from "@/usehooks/useAuth";
import {CopyTip, Refresh} from '@/components';
import {useBalanceStore} from "@/redux";
import {change_chain} from "@/utils/walletEvent";
import {toast_api} from "@/utils/T";
import {LedgerApi, MBApi} from "@/api";
import {ERC20ABI} from "@/config";

const everPayEndpoint = "https://api.everpay.io"

export type MetaMaskToken = {
  symbol: string,
  address: string,
  decimals: number
}

type TokenBalance = {
  symbol: string,
  balance: number
}

export type EverPayTokenBalance = TokenBalance
  & {
  tag: string,
  burnFeeMap: Record<string, string>,
  transferFee: string,
  atomicBundleFee: string,
  decimals: number
}


const tokenArr: MetaMaskToken[] = [
  {
    symbol: "ETH",
    address: "",
    decimals: 18
  },
  {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6
  }
]

const get_ERC20_balance = async (token: MetaMaskToken): Promise<number> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const address = await get_eth_address()
  const tokenInst = new ethers.Contract(token.address, ERC20ABI, provider)
  const balance = await tokenInst.balanceOf(address)
  return +(+ethers.utils.formatUnits(balance, token.decimals)).toFixed(5)
}

const get_eth_balance = async (): Promise<number> => {
  const res = await window.ethereum.request({
    method: "eth_getBalance",
    params: [await get_eth_address(), "latest"]
  })
  return +(+ethers.utils.formatEther(res)).toFixed(5)
}


const getBalance = async (token: MetaMaskToken): Promise<TokenBalance> => {
  if (token.symbol === "ETH") {
    return {
      symbol: "ETH",
      balance: await get_eth_balance()
    }
  } else {
    return {
      symbol: token.symbol,
      balance: await get_ERC20_balance(token)
    }
  }
}

type Chain = "everpay" | "ICP"
let timer

export const Deposit = React.memo(() => {
  const [depositAmount, setDepositAmount] = useState(0)
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const [selectedToken, setSelectedToken] = useState<TokenBalance>()
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [chain, setChain] = useState<Chain>("everpay")
  const [allBalance, setAllBalance] = useState<TokenBalance[]>([])
  const [everPayBalance, setEverPayBalance] = useState<EverPayTokenBalance[]>([])
  const [action, setAction] = useState<"deposit" | "withdraw">("deposit")
  const balance = useBalanceStore()

  useEffect(() => {
    setWithdrawAddress("")
    setDepositAmount(0)
    setWithdrawAmount(0)
  }, [JSON.stringify(selectedToken), chain, action])

  const {fee, total}: { fee: number, total: number } = React.useMemo(() => {
    const init = {fee: 0, total: 0}
    if (!selectedToken) return init
    const selectTokenInfo = everPayBalance.find(e => e.symbol === selectedToken.symbol)
    if (!selectTokenInfo) return init
    const fee: number = +ethers.utils.formatUnits(selectTokenInfo.burnFeeMap.ethereum, selectTokenInfo.decimals) ?? 0
    return {
      fee,
      total: +(fee + withdrawAmount).toFixed(6)
    }
  }, [selectedToken, everPayBalance, withdrawAmount])

  const get_everpay_balance = async (symbols: string[]): Promise<EverPayTokenBalance[]> => {
    const address = await get_eth_address()
    return await buildUpEverPayToken(address, symbols)
  }

  const getAllBalance = async () => {
    const allPromise: Promise<TokenBalance>[] = []
    for (let i = 0; i < tokenArr.length; i++) {
      allPromise.push(getBalance(tokenArr[i]))
    }
    const symbols: string[] = []
    tokenArr.forEach(e => symbols.push(e.symbol))
    Promise.all(allPromise).then(res => setAllBalance(res))
    get_everpay_balance(symbols).then(res => setEverPayBalance(res))
  }

  useEffect(() => {
    !selectedToken && setSelectedToken(allBalance[0])
  }, [selectedToken, allBalance])

  const checkChain = async () => {
    const chanId = window.ethereum.chainId
    if (chanId !== "0x1") await change_chain("0x1")
    getAllBalance()
    timer = setInterval(() => {
      getAllBalance()
    }, 5000)
  }

  useEffect(() => {
    checkChain()

    return () => {
      clearInterval(timer)
    }
  }, [])


  const deposit = React.useCallback(async (amount: number): Promise<EthereumTransaction | ArweaveTransaction> => {
    try {
      if (selectedToken) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const everpay = new Everpay({
          account: await get_eth_address(),
          chainType: ChainType.ethereum,
          ethConnectedSigner: signer
        })
        return await everpay.deposit({
          symbol: selectedToken.symbol,
          amount: amount + ""
        })
      }
      throw new Error("token is undefined")
    } catch (e) {
      throw e
    }
  }, [selectedToken])

  const handleDeposit = React.useCallback(async () => {
    if (depositAmount <= 0) return
    const handler = () => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await deposit(depositAmount) as EthereumTransaction
          const tx = res.hash
          const t = await retryInquireEverpay(tx)
          if (t === "success") return resolve("")
          return reject()
        } catch (e) {
          reject(e)
        }
      })
    }

    await toast_api(handler, selectedToken ? selectedToken.symbol : "token", "deposit", true)
    getAllBalance().then()
  }, [depositAmount, selectedToken])

  const withdraw = async () => {
    try {
      if (selectedToken) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const everpay = new Everpay({
          account: await get_eth_address(),
          chainType: ChainType.ethereum,
          ethConnectedSigner: signer
        })
        return await everpay.withdraw({
          chainType: ChainType.ethereum,
          symbol: selectedToken.symbol,
          amount: withdrawAmount + "",
          to: withdrawAddress
        })
      }
      throw new Error("token is undefined")
    } catch (e) {
      throw e
    }
  }

  const handleWithdraw = React.useCallback(async () => {
    if (withdrawAmount <= 0) return
    const handler = () => {
      return new Promise(async (resolve, reject) => {
        try {
          if (!selectedToken) return reject("token error")
          const address = withdrawAddress.trim()
          if (address.length !== 42) return reject("address error")
          if (total > selectedToken.balance) return reject("Insufficient balance")
          const res: SendEverpayTxResult = await withdraw()
          const tx = res.everHash
          const t = await inquireWithdrawEverpayTx(tx)
          if (t) return resolve("")
          return reject()
        } catch (e) {
          reject(e)
        }
      })
    }

    await toast_api(handler, selectedToken ? selectedToken.symbol : "token", "withdraw", true)
    getAllBalance().then()
  }, [withdrawAmount, withdrawAddress, selectedToken, total])

  const icpWithdraw = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (withdrawAmount >= balance) return reject("Insufficient balance")
        const address = withdrawAddress.trim()
        if (!address) return reject("address is empty")
        const res = await MBApi.transferOutICP(address, withdrawAmount)
        if ("ok" in res) return resolve(res.ok)
        return reject(Object.keys(res.err)[0])
      } catch (e) {
        reject(e)
      }
    })
  }

  const handleICPWithdraw = React.useCallback(async () => {
    if (withdrawAmount <= 0) return
    await toast_api(icpWithdraw, withdrawAmount + "ICP", "withdraw", true)
    LedgerApi.account_balance()
  }, [withdrawAmount, withdrawAddress, balance])

  const retryInquireEverpay = async (txHash: string) => {
    const transactionRes = await fetch(`${everPayEndpoint}/minted/${txHash}`)
    const json_res = await transactionRes.json()
    console.log(json_res)
    if (json_res.tx === null) {
      await sleep(4000)
      return await retryInquireEverpay(txHash)
    } else return JSON.parse(json_res.tx.internalStatus).status
  }

  const props = React.useMemo(() => {
    return {
      chain,
      setChain,
      everPayBalance,
      allBalance,
      depositAmount,
      setDepositAmount,
      selectedToken,
      setSelectedToken,
      handleDeposit, handleWithdraw, setWithdrawAmount,
      withdrawAmount, setWithdrawAddress, fee, total, handleICPWithdraw
    }
  }, [fee, total, handleICPWithdraw, setWithdrawAddress, setWithdrawAmount, withdrawAmount, handleWithdraw, chain, setChain, everPayBalance, allBalance, depositAmount, setDepositAmount, selectedToken, setSelectedToken, setDepositAmount, handleDeposit])

  return <Styled.MainStyles>
    <Styled.ContentWrap>
      <ActionPanel action={action} setAction={setAction}/>
      {action === "deposit" ? <DepositComponent {...props}/> : <WithdrawComponent {...props}/>}
    </Styled.ContentWrap>
  </Styled.MainStyles>
})

const ActionPanel = React.memo((props: {
  action: "deposit" | "withdraw",
  setAction: Function
}) => {
  const {action, setAction} = props
  return <Styled.ContentHead>
    <Styled.ContentHeadItem onClick={() => setAction("deposit")} isClick={action === "deposit"}>
      充值
    </Styled.ContentHeadItem>
    <Styled.ContentHeadItem onClick={() => setAction("withdraw")} isClick={action === "withdraw"}>
      提现
    </Styled.ContentHeadItem>
  </Styled.ContentHead>
})

const WithdrawComponent = React.memo((props: {
  chain: Chain,
  setChain: Function,
  handleWithdraw: React.MouseEventHandler<HTMLDivElement>,
  handleICPWithdraw: React.MouseEventHandler<HTMLDivElement>,
  allBalance: TokenBalance[],
  everPayBalance: EverPayTokenBalance[],
  selectedToken?: TokenBalance,
  setSelectedToken: Function,
  setWithdrawAmount: Function,
  withdrawAmount: number,
  setWithdrawAddress: Function,
  fee: number,
  total: number
}) => {
  return <Styled.ContentBody>
    <SelectChain {...props}/>
    {props.chain === "everpay" ? <EverPayWithDraw isDrop={props.withdrawAmount > 0}  {...props}/> :
      <ICPWithdraw isDrop={props.withdrawAmount > 0} {...props}/>}
  </Styled.ContentBody>
})

const ICPWithdraw = React.memo((props: { setWithdrawAmount: Function, isDrop: boolean, setWithdrawAddress: Function, handleICPWithdraw: React.MouseEventHandler<HTMLDivElement> }) => {
  const balance = useBalanceStore()


  const handle = () => {
    return (e) => {
      props.setWithdrawAmount(+e.target.value)
    }
  }

  return <>
    <div style={{width: "100%", fontWeight: "bold"}}>
      余额 : {balance}
    </div>
    <div style={{width: "100%"}}>
      <Styled.BodyHeadContent style={{fontWeight: "bold", paddingBottom: "2rem"}}>
        提现金额
      </Styled.BodyHeadContent>
      <Styled.BodyInput>
        <Styled.Input onChange={handle()} type={"number"} min={0}
                      style={{textAlign: "left"}}/>
      </Styled.BodyInput>
    </div>
    <WithdrawInput setWithdrawAddress={props.setWithdrawAddress} placeholder={"ICP 钱包地址"}/>
    <ActionButton text={"提现"} {...props} callBack={props.handleICPWithdraw}/>
  </>
})

const EverPayWithDraw = React.memo((props: {
  isDrop: boolean,
  handleWithdraw: React.MouseEventHandler<HTMLDivElement>,
  allBalance: TokenBalance[],
  everPayBalance: EverPayTokenBalance[],
  setSelectedToken: Function,
  setWithdrawAmount: Function,
  setWithdrawAddress: Function,
  fee: number,
  total: number
}) => {
  const {fee, total, setWithdrawAmount, setWithdrawAddress} = props

  return <>
    <Styled.BodyCenter>
      <EverPayWithDrawInputComponent {...props} handleChange={setWithdrawAmount}/>
    </Styled.BodyCenter>
    <WithdrawInput setWithdrawAddress={setWithdrawAddress} placeholder={"ethereum 钱包地址"}/>
    <Styled.BodyHeadContent style={{fontWeight: "bold", width: "100%"}}>
      手续费: &nbsp; &nbsp;{fee}
    </Styled.BodyHeadContent>
    <Styled.BodyHeadContent style={{fontWeight: "bold", width: "100%"}}>
      总花费: &nbsp;&nbsp; {total}
    </Styled.BodyHeadContent>
    <ActionButton text={"提现"} {...props} callBack={props.handleWithdraw}/>
  </>
})

const WithdrawInput = React.memo((props: { placeholder: string, setWithdrawAddress: Function }) => {
  const {placeholder, setWithdrawAddress} = props

  const handle = () => {
    return (e) => {
      setWithdrawAddress(e.target.value)
    }
  }

  return <div style={{width: "100%"}}>
    <Styled.BodyHeadContent style={{fontWeight: "bold", paddingBottom: "2rem"}}>
      提现到
    </Styled.BodyHeadContent>
    <Styled.BodyInput>
      <Styled.Input onChange={handle()} placeholder={placeholder}
                    style={{textAlign: "left"}}/>
    </Styled.BodyInput>
  </div>
})

const EverPayWithDrawInputComponent = React.memo((props:
                                                    {
                                                      allBalance: TokenBalance[],
                                                      everPayBalance: EverPayTokenBalance[],
                                                      handleChange: Function,
                                                      selectedToken?: TokenBalance,
                                                      setSelectedToken: Function
                                                    }) => {
  return <>
    <EverPayBalance {...props}/>
    <SelectTokenComponent {...props}/>
  </>
})

const SelectTokenComponent = React.memo((props: {
  allBalance: TokenBalance[],
  handleChange: Function,
  selectedToken?: TokenBalance,
  setSelectedToken: Function
}) => {
  const [isClick, setIsClick] = useState(false)
  const {handleChange, selectedToken, setSelectedToken, allBalance} = props

  const handleClick = (v: TokenBalance) => {
    return () => {
      setSelectedToken(v)
      setIsClick(false)
    }
  }

  const handle = () => {
    return (e) => {
      handleChange(+e.target.value)
    }
  }

  return <Styled.BodyInput>
    <Styled.SelectWrap isShow={isClick}>
      {
        allBalance.map((v, k) =>
          <Styled.TokenItem key={k} onClick={handleClick(v)}>
            {v.symbol}
          </Styled.TokenItem>
        )
      }
    </Styled.SelectWrap>
    <Box ai={"center"} onClick={() => setIsClick(!isClick)} style={{cursor: "pointer"}}>
      <Styled.BodyHeadContent style={{fontWeight: "bold"}}>
        {selectedToken?.symbol}
      </Styled.BodyHeadContent>
      <Box width={"0.6rem"}/>
      <Box jc={"center"} ai={"center"}>
        <Icon name={"bottomArrow"} color={"black"}/>
      </Box>
    </Box>
    <Styled.Input type={"number"} min={0} onChange={handle()}/>
  </Styled.BodyInput>
})

const DepositComponent = React.memo((
  props: {
    chain: Chain,
    setChain: Function,
    everPayBalance: EverPayTokenBalance[],
    allBalance: TokenBalance[],
    depositAmount: number,
    selectedToken: TokenBalance | undefined,
    setSelectedToken: Function,
    setDepositAmount: Function,
    handleDeposit: React.MouseEventHandler<HTMLDivElement>
  }
) => {
  const {chain, handleDeposit, depositAmount} = props
  return <Styled.ContentBody>
    <SelectChain {...props}/>
    {chain === "everpay" ?
      <EverPay {...props} isDrop={depositAmount > 0} callBack={handleDeposit}/> : <ICPAccount/>}
  </Styled.ContentBody>
})


const ICPAccount = React.memo(() => {
  const {subAccountId} = useAuth()
  const balance = useBalanceStore()
  const handleRefresh = React.useCallback(async () => {
    await LedgerApi.account_balance()
  }, [])
  return <Styled.BodyCenter style={{gap: "2rem"}}>
    <Styled.BodyHeadTittle style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
      你的Account ID
      <Styled.BodyHeadContent style={{fontSize: "2rem", fontWeight: "bold", display: "flex", alignItems: "center"}}>
        ICP余额:{balance}
        &nbsp;&nbsp;
        <Refresh height={2} width={2} handleRefresh={handleRefresh}/>
      </Styled.BodyHeadContent>
    </Styled.BodyHeadTittle>
    <Styled.BodyHeadContent
      style={{fontSize: "1.5rem", fontWeight: "bold", display: "flex", alignItems: "center", overflowWrap: "anywhere"}}>
      {subAccountId}
      <div style={{width: "1rem"}}/>
      <CopyTip content={subAccountId}/>
    </Styled.BodyHeadContent>
    <Styled.BodyHeadContent>
      请向此账户打入足量的ICP用于创建Box或者给Box充值cycles
    </Styled.BodyHeadContent>
  </Styled.BodyCenter>
})

const EverPay = React.memo((props:
                              {
                                allBalance: TokenBalance[],
                                everPayBalance: EverPayTokenBalance[],
                                isDrop: boolean,
                                selectedToken: TokenBalance | undefined,
                                setSelectedToken: Function,
                                setDepositAmount: Function,
                                callBack: React.MouseEventHandler<HTMLDivElement>
                              }) => {
  const {setDepositAmount} = props
  return <>
    <Styled.BodyCenter>
      <InputComponent {...props} handleChange={setDepositAmount}/>
    </Styled.BodyCenter>
    <ActionButton text={"充值"} {...props}/>
  </>
})

const SelectChain = React.memo((props: { chain: Chain, setChain: Function }) => {
  const {chain, setChain} = props

  return <Styled.BodyHead>
    <Styled.BodyHeadTittle>
      选择区块链
    </Styled.BodyHeadTittle>
    <Styled.ContentHead style={{background: "inherit", justifyContent: "start", padding: "0"}}>
      <Styled.ContentHeadItem onClick={() => setChain("everpay")} isClick={chain === "everpay"}>
        everpay
      </Styled.ContentHeadItem>
      <Styled.ContentHeadItem onClick={() => setChain("ICP")} isClick={chain === "ICP"}>
        ICP
      </Styled.ContentHeadItem>
    </Styled.ContentHead>
  </Styled.BodyHead>
})

const InputComponent = React.memo((props:
                                     {
                                       allBalance: TokenBalance[],
                                       everPayBalance: EverPayTokenBalance[],
                                       handleChange: Function,
                                       selectedToken?: TokenBalance,
                                       setSelectedToken: Function
                                     }) => {
  const {selectedToken} = props
  return <>
    <div style={{fontSize: "1.8rem"}}>资产充值至EverPay后可用于在Arweave网络中进行存储消费</div>
    <Box jc={"space-between"}>
      <Styled.BodyHeadContent style={{fontWeight: "bold"}}>
        钱包资产
      </Styled.BodyHeadContent>
      <Styled.BodyHeadContent style={{color: "#5A5BC1"}}>
        可充值:{selectedToken?.balance}
      </Styled.BodyHeadContent>
    </Box>
    <EverPayBalance {...props}/>
    <SelectTokenComponent {...props}/>
  </>
})

const EverPayBalance = React.memo((props:
                                     {
                                       everPayBalance: EverPayTokenBalance[],
                                       selectedToken?: TokenBalance,
                                     }) => {
  const {selectedToken, everPayBalance} = props

  const select_everpay_balance = React.useMemo(() => {
    if (selectedToken) return everPayBalance.find(e => e.symbol === selectedToken.symbol)
    return undefined
  }, [selectedToken, everPayBalance])

  return <Box jc={"space-between"}>
    <Styled.BodyHeadContent style={{fontWeight: "bold"}}>
      everPay资产
    </Styled.BodyHeadContent>
    <Styled.BodyHeadContent style={{color: "#5A5BC1"}}>
      余额:{select_everpay_balance?.balance}
    </Styled.BodyHeadContent>
  </Box>
})

const ActionButton = React.memo((props: { isDrop: boolean, text: string, callBack: React.MouseEventHandler<HTMLDivElement> }) => {
  const {text, callBack, isDrop} = props
  return <Styled.BodyButton style={{cursor: isDrop ? "pointer" : "no-drop", background: isDrop ? "#8988B7" : "#CDCDD9"}}
                            onClick={callBack}>
    {text}
  </Styled.BodyButton>
})


