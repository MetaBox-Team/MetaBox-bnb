import React, {useState} from 'react';
import {WebSiteItemStyles as Styled} from "./styles";
import {Link} from "@/did/model/Profile";
import Icon from "@/icons/Icon";
import {EditLinkModal} from "@/components";
import {useBoxesStore} from '@/redux';
import {ProfileApi} from '@/api';
import {desensitizationPrincipal} from "@/utils/formate";
import {toast_api} from "@/utils/T";
import {ImgComponent} from "@/views/Profile/components/WebSiteItem/Img";

export const WebSiteItem = React.memo(({link, isShowEdit}: { link: Link, isShowEdit: boolean }) => {
  const [openEdit, setOpenEdit] = useState(false)

  return (
    <Styled.WebSiteItemWrapper>
      <EditLinkModal link={link} open={openEdit} setOpen={setOpenEdit}/>
      <ImgComponent link={link}/>
      <Title link={link} setOpenEdit={setOpenEdit} isShowEdit={isShowEdit}/>
      <Styled.TextWrap>{link.url.length > 25 ? desensitizationPrincipal(link.url, 10) : link.url}</Styled.TextWrap>
    </Styled.WebSiteItemWrapper>
  );
})


const Title = React.memo(({
                            link,
                            isShowEdit,
                            setOpenEdit,
                          }: { link: Link, isShowEdit: boolean, setOpenEdit: Function }) => {
  const {profile} = useBoxesStore()
  const handleDelete = async () => {
    if (profile) {
      const profileApi = ProfileApi(profile)
      await toast_api(profileApi.delLink(link.url),
        `${link.name}`, "delete").then(() => {
        profileApi.getLinks().then()
      })
    }
  }

  return <Styled.TitleWrapper>{link.name.length > 20 ? desensitizationPrincipal(link.name, 8) : link.name}
    <Styled.IcoWrapper style={{display: isShowEdit ? "flex" : "none"}}>
      <EditIcon setOpenEdit={setOpenEdit}/>
      <div style={{paddingRight: "21px"}}/>
      <DeleteIcon handleDelete={handleDelete}/>
    </Styled.IcoWrapper>
  </Styled.TitleWrapper>
})

const EditIcon = React.memo(({setOpenEdit}: { setOpenEdit: Function }) => {
  return <div style={{cursor: "pointer"}} onClick={() => setOpenEdit(true)}>
    <Icon name={"edit"}/>
  </div>
})

const DeleteIcon = React.memo(({handleDelete}: { handleDelete: React.MouseEventHandler<HTMLDivElement> }) => {
  return <div style={{cursor: "pointer"}} onClick={handleDelete}>
    <Icon name={"delete_link"}/>
  </div>
})
