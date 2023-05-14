import React, {useEffect, useState} from "react";
import {SignUpStyles as Styled} from "./styles";
import {Init} from "@/views/Init";
import "./index.css";
import {MBApi} from "@/api";
import {useProfileStore} from "@/redux";
import {useCache} from "@/usehooks/useCache";
import {UserIdNotFound} from "@/api/cache";

export const SignUp = React.memo(({isReset}: { isReset: boolean }) => {
  const {pre_private_key} = useProfileStore()
  const {domain} = useCache()
  const [isClick, setIsClick] = useState(false)
  const [isCouldClick, setIsCouldClick] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorText, setErrorText] = useState("")
  const [info, setInfo] = useState({
    name: "",
    userId: "",
    password: ""
  })

  useEffect(() => {
    domain && domain !== UserIdNotFound && handleChange("userId", domain)
  }, [domain])

  useEffect(() => {
    if (domain && pre_private_key && !isReset) location.reload()
  }, [domain, pre_private_key])

  useEffect(() => {
    setIsError(false)
    if (!!info.userId && !!info.password) setIsCouldClick(true)
    else setIsCouldClick(false)
  }, [info])

  const handleChange = React.useCallback((key: string, value: string) => setInfo({...info, [key]: value}), [info])

  const containsUpperCase = str => str !== str.toLowerCase();

  const handleClick = React.useCallback(async () => {
    if (!isCouldClick) return 0
    if (pre_private_key && !isReset) {
      await MBApi.setName(info.userId)
      location.reload()
    } else {
      if (containsUpperCase(info.userId)) {
        setIsError(true)
        setErrorText("Cannot contain uppercase letters")
      } else if (info.userId.indexOf(' ') !== -1) {
        setIsError(true)
        setErrorText("User ID cannot contain spaces")
      } else {
        const principal = await MBApi.getPrincipalFromName(info.userId)
        if (principal && !domain) {
          setIsError(true)
          setErrorText("User id already in use")
        } else setIsClick(true)
      }
    }
  }, [isCouldClick, info, pre_private_key])

  return (
    <>
      {isClick ? <Init name={info.name} userId={info.userId} password={info.password}/> :
        <Styled.Center className="SignUp">
          <Input isError={isError} handleChange={handleChange} domain={domain} info={info} errorText={errorText}/>
          <Button isCouldClick={isCouldClick} handleClick={handleClick}/>
        </Styled.Center>
      }
    </>
  );
})

export const Button = React.memo(({
                                    isCouldClick,
                                    handleClick
                                  }: { isCouldClick: boolean, handleClick: React.MouseEventHandler<HTMLDivElement> }) => {
  return <Styled.Button
    style={{
      cursor: isCouldClick ? "pointer" : "no-drop",
      backgroundColor: isCouldClick ? "#4E4597" : "#EEEEEF",
      color: isCouldClick ? "#FFFFFF" : "rgba(0, 0, 0, 0.2)"
    }}
    onClick={handleClick}>
    Register
  </Styled.Button>
})

export const Input = React.memo(({
                                   handleChange,
                                   isError,
                                   domain,
                                   info,
                                   errorText
                                 }: { handleChange: Function, isError: boolean, domain: string, info: any, errorText: string }) => {
  return <>
    <Styled.InputWrap>
      <Styled.Input onChange={(e) => handleChange("name", e.target.value)} placeholder={"Nick name"}/>
    </Styled.InputWrap>
    <Styled.InputWrap style={{position: "relative"}} isRepeat={isError}>
      <Styled.Input disabled={!!domain && domain !== UserIdNotFound} defaultValue={info.userId}
                    onChange={(e) => handleChange("userId", e.target.value)}
                    placeholder={"User ID(Unchangeable)"}/>
      <Styled.ErrorText style={{display: isError ? "flex" : "none"}}>{errorText}</Styled.ErrorText>
    </Styled.InputWrap>
    <Styled.InputWrap>
      <Styled.Input type={"password"} onChange={(e) => handleChange("password", e.target.value)}
                    placeholder={"Password"}/>
    </Styled.InputWrap>
  </>
})

