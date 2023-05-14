import React, {useState} from 'react';
import {WebSiteItemStyles as Styled} from "../WebSiteItem/styles";
import Icon from "@/icons/Icon";
import {BurnOgModal} from "@/components";
import {useOwnerStore} from '@/redux';

export const OGItem = React.memo(() => {
  const [openBurn, setOpenBurn] = useState(false)

  return <>
    <BurnOgModal open={openBurn} setOpen={setOpenBurn}/>
    <Styled.WebSiteItemWrapper>
      <video autoPlay loop style={{width: "100%", borderRadius: "1.2rem"}}
             src="https://arhfp-yaaaa-aaaag-qa7fq-cai.raw.ic0.app/file/HfofJqUBNJ11dPBba0JeM"/>
      <Title setOpenBurn={setOpenBurn}/>
    </Styled.WebSiteItemWrapper>
  </>
})


const Title = React.memo(({
                            setOpenBurn,
                          }: { setOpenBurn: Function }) => {
  const {isOwner} = useOwnerStore()

  const burn = React.useCallback(() => {
    isOwner && setOpenBurn(true)
  }, [isOwner])

  return <Styled.TitleWrapper style={{justifyContent: 'end'}}>
    <Styled.IcoWrapper>
      Burn&nbsp;<BurnIcon handleDelete={burn}/>
    </Styled.IcoWrapper>
  </Styled.TitleWrapper>
})

const BurnIcon = React.memo(({handleDelete}: { handleDelete: React.MouseEventHandler<HTMLDivElement> }) => {
  return <div style={{cursor: "pointer"}} onClick={handleDelete}>
    <Icon name={"burn"}/>
  </div>
})

