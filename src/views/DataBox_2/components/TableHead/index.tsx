import React from 'react';
import {DataBoxStyles as Styled} from "@/views/DataBox_2/styles";
import {ToolTip} from "@/components";
import Icon from "@/icons/Icon";
import {useTranslation} from "react-i18next";

const HeadArr = ["table_head_all_files", "table_head_all_encrypted_files",
  "table_head_all_plaintext_files", "table_head_all_shared_files"]

interface Props {
  setClickOne: Function
  clickOne: number
}

export const TableHead = React.memo(({setClickOne, clickOne}: Props) => {
  const {t} = useTranslation()
  const Translate = React.useCallback((anchor: string) => t(`DataBox.${anchor}`), [t])

  return <Styled.TableHead>
    <Styled.TableHeadLeft>
      {HeadArr.map((v, k) =>
        <Styled.TableHeadLeftItem
          key={k}
          onClick={() => setClickOne(k)}
          isClick={clickOne === k}>
          {Translate(v)}
        </Styled.TableHeadLeftItem>)}
      <Pay Translate={Translate}/>
    </Styled.TableHeadLeft>
    {/*<Right/>*/}
  </Styled.TableHead>
})

const Pay = React.memo(({Translate}: { Translate: Function }) => {
  return <ToolTip title={"coming soon"}>
    <Styled.TableHeadLeftItem
      style={{cursor: 'no-drop'}}
      isClick={false}>{Translate("table_head_all_pay_files")}
    </Styled.TableHeadLeftItem>
  </ToolTip>
})

const Right = React.memo(() => {
  return <Styled.TableHeadRight>
    <Styled.SearchBox>
      <Icon name={"search"} height={2.1} width={2.1}/>&nbsp;
      <Styled.Input placeholder={"Search"}/>
    </Styled.SearchBox>
    <div style={{paddingLeft: "3.0rem", cursor: "pointer"}}><Icon name={"Select"}/></div>
  </Styled.TableHeadRight>
})

