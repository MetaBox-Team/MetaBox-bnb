import React, {useState} from "react";
import {BoxListStyles as Styled} from "./styles"
import {TableStyles} from "@/views/DataPanel/Manage/components/Table/styles";
import Icon from "@/icons/Icon";
import {DataBoxInfo, PermissionManagementModal} from "@/components";
import {useBoxesStateStore, useBoxesStore} from "@/redux";
import {Scrollbar} from "@/styles";
import {useTranslation} from "react-i18next";
import {BoxAllInfo} from "@/did/model/MBox";
import {toast} from "react-toastify";
import {useHistory, useParams} from "react-router-dom";

export function BoxList() {
  const {boxes} = useBoxesStore()
  const [clickOne, setClickOne] = useState(-1)
  const [openManage, setOpenManage] = useState(false)

  const handleManage = React.useCallback((index: number) => {
    return (e) => {
      e.stopPropagation();
      setOpenManage(true)
      setClickOne(index)
    }
  }, [])

  return (
    <Styled.MainContainer>
      <Head/>
      <PermissionManagementModal boxItem={boxes?.[clickOne]} open={openManage} setOpen={setOpenManage}/>
      {boxes && boxes.length > 0 ?
        <Scrollbar>
          {boxes?.map((v, k) => {
            return <Item key={k} k={k} v={v} handleManage={handleManage}/>
          })}
        </Scrollbar> :
        <Styled.NonItemWrap>
          <Styled.NonItem/>
        </Styled.NonItemWrap>
      }
    </Styled.MainContainer>
  );
}

const Head = React.memo(() => {
  const {t} = useTranslation()

  return <Styled.Head>
    {t("DataPanel.databox_list")}
  </Styled.Head>
})

const Item = React.memo(({k, v, handleManage}: { k: number, v: BoxAllInfo, handleManage: Function }) => {
  const {box_avatars} = useBoxesStore()
  const {t} = useTranslation()
  const {allVersion} = useBoxesStore()
  const boxesState = useBoxesStateStore();
  const history = useHistory();
  const {user}: { user: string } = useParams()

  const {cycle} = React.useMemo(() => {
    const state = boxesState?.[k]
    const cycle = state ? Number(state.ok.balance) : 0;
    return {cycle}
  }, [boxesState, allVersion, v])

  const handleClick = React.useCallback((v: BoxAllInfo) => {
    return () => {
      if (Object.keys(v.status)[0] === "running") {
        if (cycle === 0) toast.warning(`The Box cycles are insufficient`)
        else history.push(`/databox/${v.canister_id.toString()}/${user}/${k}`)
      } else toast.warning(t("toast.start_box"))
    }
  }, [user, cycle, k, t])

  return <Styled.Item onClick={handleClick(v)}>
    <DataBoxInfo url={box_avatars && box_avatars[k]} box_name={v.box_name} width={"8.6rem"} height={"8.6rem"}/>
    <TableStyles.ManageWrap
      onClick={handleManage(k)}>
      {t("DataPanel.manage_box")}
    </TableStyles.ManageWrap>
  </Styled.Item>
})
