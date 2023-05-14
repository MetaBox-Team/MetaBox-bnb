import {Gap} from "@/components";
import {CreateStyles as Styled} from "./styles";
import {Input_2, Button} from "@/components";
import {LedgerApi} from "@/api";
import React, {useState, useEffect} from "react";
import {useAuth} from "@/usehooks/useAuth";
import {toast} from "react-toastify";
import {Principal} from "@dfinity/principal";

export default () => {
  const [value, setValue] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const {principal}: any = useAuth();
  const handleClick = () => {
    toast.promise(LedgerApi.transfer(value, 0, principal, balance), {
      pending: "transfering😄",
      success: "success 🥳",
      error: {
        render({data}) {
          return <div>{String(data)}</div>;
        },
      },
    });
  };
  const fetch = async () => {
    const res = await LedgerApi.real_account_balance(principal);
    setBalance(Number(res.e8s));
  };
  useEffect(() => {
    principal && fetch();
  }, [principal]);
  return (
    <>
      <Styled.CreateWrap>
        <Gap height={77}/>
        <Styled.TitleWrap>Transfer out your ICP</Styled.TitleWrap>
        <Gap height={17}/>
        <Styled.DescriptionWrap>
          Your balance {`${balance / 1e8}`} ICP
        </Styled.DescriptionWrap>
        <Gap height={17}/>
        <Styled.DescriptionWrap>Input your account id</Styled.DescriptionWrap>
        <Gap height={17}/>
        <Styled.InputWrap>
          <Input_2
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </Styled.InputWrap>
        <Gap height={17}/>
        <Button
          onClick={() => {
            handleClick();
          }}
        >
          Submit
        </Button>
      </Styled.CreateWrap>
    </>
  );
};
