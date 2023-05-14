import React, {useEffect, useState} from "react";
import {SignInStyles as Styled} from "./styles";
import {LoginStyles as Styles} from "../../styles";
import {updateKeyStore, useOwnerStore, useProfileStore} from "@/redux";
import {EncryptApi} from "js-databox";
import {sha256} from "js-sha256";
import {useHistory} from "react-router-dom";
import {useAuth} from "@/usehooks/useAuth";
import {desensitizationPrincipal} from "@/utils/formate";
import {Principal} from "@dfinity/principal";
import {useCache} from "@/usehooks/useCache";
import {LoadingImg} from "@/views/Login";

const decrypt = async (password_hash: string, pre_private_key?: string) => {
  if (!!pre_private_key) {
    const pre_private_key_struct = JSON.parse(pre_private_key)
    const private_key = pre_private_key_struct.encrypted_private_key
    const aes_iv = pre_private_key_struct.aes_iv
    localStorage.removeItem("test")
    return await EncryptApi.decryptPrivateKey(private_key, password_hash, aes_iv)
  } else return ""
}

export const SignIn = React.memo(({setIsReset}: { setIsReset: Function }) => {
  const {pre_private_key} = useProfileStore()
  const {principal} = useAuth()
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  const init = async () => {
    const password_hash_string = localStorage.getItem("mb_user_password")
    if (password_hash_string) {
      const password_hash_obj = JSON.parse(password_hash_string)
      const {ttl, password_hash} = password_hash_obj
      if (ttl < Date.now()) {
        localStorage.removeItem("mb_user_password")
        setLoading(false)
      } else {
        const pem_private_key = await decrypt(password_hash, pre_private_key)
        if (pem_private_key.includes("-----BEGIN PRIVATE KEY-----")) {
          updateKeyStore({privateKey: pem_private_key, passwordHash: password_hash})
          if (location.pathname === "/") history.push(`/datapanel/${String(principal)}`)
          // else history.push(`${location.pathname}`)
        } else {
          localStorage.removeItem("mb_user_password")
          setLoading(false)
        }
      }
    } else setLoading(false)
  }

  useEffect(() => {
    pre_private_key && init().then()
  }, [pre_private_key])

  return (
    <>
      {loading ? <LoadingImg/> :
        <Main setIsReset={setIsReset} principal={principal} pre_private_key={pre_private_key}/>}
    </>
  );
})

const Main = React.memo(({
                           principal,
                           pre_private_key, setIsReset
                         }: { setIsReset: Function, principal: Principal | undefined, pre_private_key?: string }) => {
  const {name} = useProfileStore()
  const [password, setPassword] = useState("")
  const [isError, setIsError] = useState(false)
  const history = useHistory()

  useEffect(() => {
    setIsError(false)
  }, [password])

  const handleClick = React.useCallback(async () => {
    if (password) {
      const pem_private_key = await decrypt(sha256(password), pre_private_key)
      if (pem_private_key.includes("-----BEGIN PRIVATE KEY-----")) {
        updateKeyStore({privateKey: pem_private_key, passwordHash: sha256(password)})
        localStorage.setItem("mb_user_password", JSON.stringify({
          password_hash: sha256(password),
          ttl: Date.now() + 8 * 60 * 60 * 1000//密码存储时间
        }))
        if (location.pathname === "/") history.push(`/datapanel/${String(principal)}`)
        else history.push(`${location.pathname}`)
      } else setIsError(true)
    }
  }, [password, principal])

  return <Styled.Center>
    <Welcome name={name}/>
    <Info name={name}/>
    <Input setPassword={setPassword} isError={isError}/>
    <Button handleClick={handleClick}/>
    <ResetButton setIsReset={setIsReset}/>
    <Tip/>
  </Styled.Center>
})

const Tip = React.memo(() => {
  return <Styled.TipText>Please note that previously uploaded encrypted files cannot be downloaded after resetting the
    password</Styled.TipText>
})

const ResetButton = React.memo(({setIsReset}: { setIsReset: Function }) => {
  return <Styled.ResetButton onClick={() => setIsReset(true)}>Reset</Styled.ResetButton>
})

const Loading = React.memo(() => <Styles.LoadingImg/>)

const Welcome = React.memo(({name}: { name?: string }) => {
  const {isOwner} = useOwnerStore()
  return <>
    {isOwner ? <Styled.Welcome>Welcome back!</Styled.Welcome>
      : <Styled.Welcome>Welcome to &nbsp;
        <div style={{color: '#3FCA6E'}}>{name}</div>
        's space
      </Styled.Welcome>}
  </>
})

const Info = React.memo(({name}: { name?: string }) => {
  const {domain} = useCache()
  const {avatar_url} = useProfileStore()
  const [url, setUrl] = useState("")
  const short_name = React.useMemo(() => {
    return name && name.length > 10 ? desensitizationPrincipal(name, 4) : name
  }, [name])

  const short_domain = React.useMemo(() => {
    return domain && domain.length > 10 ? desensitizationPrincipal(domain, 4) : domain
  }, [domain])

  useEffect(() => {
    if (avatar_url) {
      fetch(avatar_url).then(e => {
        if (e.ok) setUrl(avatar_url)
      })
    }
  }, [avatar_url])

  return <Styled.InfoWrap>
    <Styled.ProfileAvatar imgUrl={url}/>
    <Styled.ProfileInfo>
      <Styled.Name>{short_name}</Styled.Name>
      <Styled.UID>{short_domain}</Styled.UID>
    </Styled.ProfileInfo>
  </Styled.InfoWrap>
})

const Input = React.memo(({setPassword, isError}: { setPassword: Function, isError: boolean }) => {
  return <Styled.InputWrap isHover={true}>
    <Styled.Input type={"password"} placeholder="Enter your password"
                  onChange={e => setPassword(e.target.value)}/>
    <Styled.ErrorTip style={{display: isError ? "flex" : "none"}}>wrong password</Styled.ErrorTip>
  </Styled.InputWrap>
})

const Button = React.memo(({handleClick}: { handleClick: React.MouseEventHandler<HTMLDivElement> }) => {
  return <Styled.SignInButton onClick={handleClick}>Log in</Styled.SignInButton>
})

