import {Modal} from 'antd';
import {LoginStyles as Styled} from "./styles";
import React, {useCallback, useEffect, useState} from 'react';
import "./index.css";
import {FileRejection, useDropzone} from "react-dropzone";
import {useParams} from "react-router-dom";
import {DataBoxApi, MBApi} from "@/api";
import {SelectInput, ToolTip} from "@/components";
import {useTranslation} from "react-i18next";
import {Footer} from "@/components/Modals/components";
import {toast} from "react-toastify";
import {go_to_error, upload_toast} from "@/utils/T";
import {useAuth} from "@/usehooks/useAuth";
import {desensitizationPrincipal} from "@/utils/formate";
import {getEverPayBalance, sleep} from "@/utils/common";
import {BalanceItem} from "everpay/cjs/types";
import {useCache} from "@/usehooks/useCache";

const encrypt_max_size = 100 * 1024 * 1024
const max_size = 300 * 1024 * 1024
type FILE_TYPE = "Encrypt" | "Plain"
export type Wallet_Type = "Everpay" //| "Evervision"

export const UploadModal = React.memo(({open, setOpen}: { open: boolean, setOpen: Function }) => {
  const [permission, setPermission] = useState('Private')
  const [fileType, setFileType] = useState<FILE_TYPE>('Encrypt')
  const [files, setFiles] = useState<File[]>([])
  const [rejectArr, setRejectArr] = useState<FileRejection[]>([])
  const [value, setValue] = useState(0);
  const [walletType, setWalletType] = useState<Wallet_Type>("Everpay")
  const [tip, setTip] = useState({isShow: false, text: ""})
  const [everPayToken, setEverPayToken] = useState("ETH")
  const [symbols, setSymbols] = useState<BalanceItem[]>([])
  const {canister_id}: { canister_id: string } = useParams()
  const {publicKey} = useCache()
  const {principal} = useAuth()
  const {t} = useTranslation()

  const fetch = async () => {
    let addr: string = ''
    await window.ethereum.enable()
    addr = window.ethereum.selectedAddress
    const t = await getEverPayBalance(addr)
    const res = t.filter(e => e.symbol === "ETH" || e.symbol === "USDT")
    setSymbols(res)
  }

  useEffect(() => {
    fetch()
  }, [walletType])

  const onDrop = React.useCallback((files: File[]) => {
    const acceptFiles: File[] = []
    const rejectFiles: FileRejection[] = []
    const maxSize = fileType === "Encrypt" ? encrypt_max_size : max_size
    let total_size = 0
    const text = fileType === "Encrypt" ? "tip_2" : "tip_1"
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > maxSize) {
        rejectFiles.push({file, errors: [{message: text, code: ""}]})
      } else {
        acceptFiles.push(file)
        total_size += file.size
      }
    }
    if (total_size > maxSize) setTip({isShow: true, text})
    else {
      setFiles(acceptFiles)
      setRejectArr(rejectFiles)
    }
  }, [fileType])

  const dataBoxApi = React.useMemo(() => {
    return DataBoxApi(canister_id)
  }, [canister_id])


  const T = useCallback((a: string) => t(`Modal.UploadModal.${a}`), [t])

  useEffect(() => {
    init()
    setValue(0)
  }, [fileType, open])

  const init = () => {
    setTip({isShow: false, text: ""})
    setFiles([])
    setRejectArr([])
  }

  const clear = React.useCallback(() => {
    setOpen(false)
    init()
  }, [])

  useEffect(() => {
    files.length > 0 && setTip({isShow: false, text: ""})
  }, [files])

  useEffect(() => {
    setTip({isShow: false, text: ""})
  }, [value, everPayToken])

  const calculate_balance = async () => {
    let size = 0
    files.forEach(file => size += file.size)
    const toastId = toast.loading(`🦄 calculate balance...`, {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      autoClose: false
    })
    const tip = await dataBoxApi.is_enough_to_upload(size)
    if (tip !== -1) {
      const number = Number(tip.toFixed(3)) + 0.01
      go_to_error(toastId, `Insufficient balance, please recharge at least ${number}T cycles`)
      setTimeout(() => {
        toast.dismiss(toastId)
      }, 3000)
      return {isEnough: false, toastId}
    } else {
      return {isEnough: true, toastId}
    }
  }
  const handleUpload = async () => {
    try {
      if (files.length === 0) {
        setTip({isShow: true, text: "tip_0"})
        return
      }
      if (value === 2) {
        const symbol = symbols.find(e => e.symbol === everPayToken)
        if (symbol) {
          if (+symbol.balance <= 0) {
            setTip({isShow: true, text: "tip_3"})
            setFiles([])
            return
          }
        } else throw new Error("symbol not found")
      }
      clear()
      const {isEnough, toastId} = await calculate_balance()
      if (!isEnough) return 0
      upload_toast(toastId)
      if (fileType === "Encrypt") {
        if (value === 0) await dataBoxApi.putEncryptFile(files, true, publicKey, toastId)
        else if (value === 2) await dataBoxApi.putEncryptFileToAr(files, true, toastId, everPayToken, walletType, publicKey)
        else if (value === 1) await dataBoxApi.putEncryptedFileToIFPS(files, true, toastId, publicKey)
      } else {
        if (value === 0) await dataBoxApi.putPlainFile(files, permission === "Private", toastId)
        else if (value === 1) await dataBoxApi.putPlainFileToIPFS(files, permission === "Private", toastId)
        else await dataBoxApi.putPlainFileToAr(files, permission === "Private", toastId, everPayToken, walletType)
      }
      MBApi.getBoxes(principal).then()
    } catch (e) {
      console.warn("upload error", e)
    }
    await sleep(1000)
    dataBoxApi.refresh()
  }

  const props = React.useMemo(() => {
    return {T, fileType, setFileType, value, setValue, setPermission, permission}
  }, [T, fileType, setFileType, value, setValue, setPermission, permission])

  const {getRootProps, getInputProps} = useDropzone({onDrop, multiple: true})

  const acceptedFileItems = React.useMemo(() => {
    return files.map((file, k) => (
      <li key={k} style={{display: 'flex'}}>
        {file.name.length > 25 ? desensitizationPrincipal(file.name, 10) : file.name}
        <div style={{color: "blue"}}>✓</div>
      </li>
    ))
  }, [files])

  const fileRejectionItems = React.useMemo(() => {
    return rejectArr.map(({file, errors}) => {
      return <li key={file.name} style={{display: 'flex', gap: "1rem"}}>
        {file.name.length > 25 ? desensitizationPrincipal(file.name, 10) : file.name}
        <div style={{color: "deeppink", fontSize: "0.5rem", display: "flex", alignItems: "center"}}>❌</div>
        <ul>
          {errors.map((e, k) => {
            return <li key={k} style={{color: "deeppink"}}>{T(e.message)}</li>
          })}
        </ul>
      </li>
    })
  }, [rejectArr])

  return (
    <>
      <Modal
        maskClosable={false}
        key={'UploadModal'}
        wrapClassName={'UploadModal'}
        title={
          [<div style={{color: '#4E4597', textAlign: 'center', fontSize: 25}}
                key={"UploadModalTitle"}>{T("title")}</div>]
        }
        width={"60rem"}
        style={{top: "10rem"}}
        footer={
          [
            <Footer key={"UploadModalFooter"} clear={clear} handleClick={handleUpload}/>
          ]
        }
        open={open}
        closable={false}
      >
        <Styled.Body>
          <Styled.BodySelector className={'UploadModalSelector'}>
            <Text T={T} text={"file_type"}/>
            <Item_1 {...props}/>
            <Text T={T} text={"store_location"}/>
            <Item_2 {...props}/>
            {fileType !== "Encrypt" && <>
              <Styled.ConfigText>{T("permission")}</Styled.ConfigText>
              <Item_3 {...props}/>
            </>}
            {value === 2 &&
              <>
                <Text T={T} text={"wallet"}/>
                <SelectWallet wallet_arr={["Everpay"]} item={walletType} setItem={setWalletType}/>
              </>
            }
            {value === 2 &&
              <>
                <Text T={T} text={"token"}/>
                <SelectToken item={everPayToken} setItem={setEverPayToken} symbols={symbols}/>
              </>
            }
            <Text T={T} text={"upload"}/>
            <Input T={T} getInputProps={getInputProps} getRootProps={getRootProps}/>
            <FileList tip={tip} T={T} acceptArr={acceptedFileItems} rejectArr={fileRejectionItems}/>
          </Styled.BodySelector>
        </Styled.Body>
      </Modal>
    </>
  );
});

export const SelectWallet = React.memo((props: { item: string, setItem: Function, wallet_arr: string[] }) => {
  const {wallet_arr} = props
  return <SelectInput
    itemComponent=
      {
        wallet_arr.map((v, k) => {
          return WalletItemComponent({setItem: props.setItem, v: v, k: k})
        })
      }
    {...props} />
})

const SelectToken = React.memo((props: { item: string, setItem: Function, symbols: BalanceItem[] }) => {
  return <SelectInput
    itemComponent=
      {
        props.symbols.map((v, k) => {
          return ItemComponent({setItem: props.setItem, v: v, k: k})
        })
      }
    {...props} />
})

const WalletItemComponent = (props: { setItem: Function, v: string, k: number }) => {
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

const ItemComponent = (props: { setItem: Function, v: BalanceItem, k: number }) => {
  const {v, setItem} = props
  return (setIsShow: Function) => {
    return <Styled.DropdownItem key={props.k} onClick={() => {
      setItem(v.symbol)
      setIsShow(false)
    }}>
      <div style={{color: "#787878", fontSize: "2.5rem"}}>{v.symbol}</div>
      <div style={{color: "#787878", fontSize: "2.5rem"}}>{v.balance}</div>
    </Styled.DropdownItem>
  }
}

const Text = React.memo((props: { T: Function, text: string }) => {
  const {T, text} = props
  return <Styled.ConfigText>{T(text)}</Styled.ConfigText>
})

const FileList = React.memo(({
                               tip,
                               T,
                               rejectArr,
                               acceptArr
                             }: { tip: { isShow: boolean, text: string }, T, rejectArr: JSX.Element[], acceptArr: JSX.Element[] }) => {
  return <Styled.FileList>
    {tip.isShow
      ? <div style={{color: "red", display: "flex", alignItems: "center"}}> * {T(`${tip.text}`)}</div>
      : <>
        {acceptArr}
        {rejectArr}
      </>
    }
  </Styled.FileList>
})

const Input = React.memo(({getRootProps, getInputProps, T}: { getRootProps, getInputProps, T }) => {
  return <Styled.FileSelector{...getRootProps()}>
    <input {...getInputProps()} />
    {T("drop")}
  </Styled.FileSelector>
})

const Item_1 = React.memo((props: { fileType, T, setFileType }) => {
  const {fileType, T, setFileType} = props
  return <Styled.Radio>
    <Styled.RadioItem style={{borderRadius: ".6rem 0 0 .6rem"}} isClick={fileType === "Encrypt"}
                      onClick={() => setFileType('Encrypt')}>{T("encrypt")}</Styled.RadioItem>
    <Styled.RadioItem isClick={fileType === "Plain"} style={{borderRadius: "0 .6rem .6rem .0rem"}}
                      onClick={() => setFileType('Plain')}>{T("plain")}</Styled.RadioItem>
  </Styled.Radio>
})

const Item_2 = React.memo((props: { value, setValue }) => {
  const {value, setValue} = props
  return <Styled.Radio>
    <Styled.RadioItem style={{borderRadius: ".6rem 0 0 .6rem"}} isClick={value === 0}
                      onClick={() => setValue(0)}>Box</Styled.RadioItem>
    <Styled.RadioItem isClick={value === 1}
                      onClick={() => setValue(1)}>IPFS</Styled.RadioItem>
    {/*<IPFS/>*/}
    <Styled.RadioItem isClick={value === 2} onClick={() => setValue(2)} style={{borderRadius: "0 .6rem .6rem .0rem"}}>
      Arweave
    </Styled.RadioItem>
  </Styled.Radio>
})

const IPFS = React.memo(() =>
  <ToolTip title={"coming soon"}>
    <Styled.RadioItem isClick={false} style={{cursor: "no-drop"}}>
      IPFS
    </Styled.RadioItem>
  </ToolTip>
)

const Arweave = React.memo(() =>
  <Styled.RadioItem isClick={false} style={{borderRadius: "0 .6rem .6rem .0rem"}}>
    Arweave
  </Styled.RadioItem>
)

const Item_3 = React.memo((props: { permission, setPermission, T }) => {
  const {permission, setPermission, T} = props
  return <Styled.Radio>
    <Styled.RadioItem style={{borderRadius: ".6rem 0 0 .6rem"}} isClick={permission === "Private"}
                      onClick={() => setPermission('Private')}>{T("private")}</Styled.RadioItem>
    <Styled.RadioItem isClick={permission === "Public"} style={{borderRadius: "0 .6rem .6rem .0rem"}}
                      onClick={() => setPermission('Public')}>{T("public")}</Styled.RadioItem>
  </Styled.Radio>
})

