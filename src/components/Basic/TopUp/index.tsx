import React, {useEffect, useRef} from "react";
import {TopUpStyles as Styled} from "@/components/Basic/TopUp/styles";
import {useBalanceStore, useRateStore} from "@/redux";
import {Box} from "@/styles";
import {LedgerApi, MBApi, XTCApi} from "@/api";
import {toast} from "react-toastify";
import {Props as props, useAuth} from "@/usehooks/useAuth";
import {BurnArgs} from "@/did/model/XTC";

function TopUp({whichOne, setOpen}) {
  const [amount, setAmount] = React.useState(0);
  const [isShowTip, setIsShowTip] = React.useState(false);
  const [whichWay, setWhichWay] = React.useState<0 | 1>(0)
  const [equalCycle, setEqualCycle] = React.useState<number>(0);
  const inputRef = useRef(null);
  const {principal}: props = useAuth();
  const balance = useBalanceStore();
  const rate = useRateStore();

  const cleanInput = () => {
    //@ts-ignore
    if (inputRef.current) inputRef.current.value = "0";
    setAmount(0)
  }

  useEffect(() => {
    cleanInput()
  }, [whichWay])

  const topUpWithXTC = () => {
    const burnArg: BurnArgs = {
      canister_id: whichOne,
      amount: BigInt(Number(amount) * 1e12)
    }
    toast.promise(
      XTCApi.burn(burnArg),
      {
        pending: `top uping 😄`,
        success: `success 🥳`,
        error: "Error",
      }
    ).then(re => MBApi.getBoxes(principal).then())
    setOpen()
    cleanInput()
    setAmount(0);
  }

  const add = () => {
    toast
    .promise(MBApi.topUpCanister(Number(amount), whichOne), {
      pending: "topUp Box ing😄",
      success: {
        render({data}) {
          return <div>{"Top up of " + String(data) + "cycles"}</div>;
        },
      },
      error: {
        render({data}) {
          return <div>{String(data)}</div>;
        },
      },
    })
    .then((re) => {
      if (re) MBApi.getBoxes(principal).then();
      LedgerApi.account_balance().then();
    });
    setOpen()
    cleanInput()
    setAmount(0);
  };

  useEffect(() => {
    setEqualCycle(amount * 1e8 * rate);
    if ((amount * 1e8 > balance && balance >= 0) || amount <= 0.02)
      setIsShowTip(true);
    else setIsShowTip(false);
  }, [amount, rate]);

  return (
    <Styled.Main onClick={(e) => e.stopPropagation()}>
      <Styled.HeadWrap>
        <Styled.HeadText>Top Up cycles</Styled.HeadText>
        <Styled.HeadTagPageWrapper>
          <Styled.HeadTagPageButton onClick={() => setWhichWay(0)} isClick={whichWay === 0}>
            With Balance
          </Styled.HeadTagPageButton>
          <Styled.HeadTagPageButton onClick={() => setWhichWay(1)} isClick={whichWay === 1}>
            With XTC
          </Styled.HeadTagPageButton>
        </Styled.HeadTagPageWrapper>
      </Styled.HeadWrap>

      <Styled.MiddleWrap>
        <Styled.TextWrap>Amount({whichWay === 0 ? "ICP" : "XTC  1XTC = 1T Cycle"})</Styled.TextWrap>
        <Styled.InputWrap
          ref={inputRef}
          placeholder={"0"}
          type={"number"}
          min={"0.01"}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </Styled.MiddleWrap>
      <Box width={"100%"} jc={"space-between"}>
        <Styled.TipWrap isShow={whichWay === 0 && isShowTip}>
          &nbsp;{" "}
          {amount <= 0.02
            ? "Must be greater than 0.02"
            : "Insufficient Balance"}
        </Styled.TipWrap>
        <Styled.TipWrap style={{color: "#999999"}} isShow={whichWay === 0 && equalCycle > 0}>
          ≈ {(equalCycle / 1e12).toFixed(3)}T
        </Styled.TipWrap>
      </Box>
      <Styled.FootWrap>
        <Styled.ButtonWrap
          disabled={whichWay === 0 ? amount <= 0.02 || isShowTip : amount <= 0}
          isDisabled={whichWay === 0 ? amount <= 0.02 || isShowTip : amount <= 0}
          style={{background: "#0052ff", color: "white"}}
          onClick={() => whichWay === 0 ? add() : topUpWithXTC()}>
          Confirm
        </Styled.ButtonWrap>
        <Styled.ButtonWrap
          style={{border: "1px solid #0052FF", color: "#0052ff"}}
          onClick={() => {
            setOpen()
            setAmount(0);
            //@ts-ignore
            inputRef.current.value = "0";
          }}>
          Cancel
        </Styled.ButtonWrap>
      </Styled.FootWrap>
    </Styled.Main>
  );
}

export default TopUp;
