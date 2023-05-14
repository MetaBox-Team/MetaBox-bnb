import styled from "styled-components"

export namespace DetailDrawerStyles {
  export const TittleWrap = styled.div`
    display: flex;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 3.9rem;
    color: #787878;
  `

  export const ItemWrap = styled.div`
    display: flex;
    width: 100%;
    align-items: start;
    margin-bottom:1.0rem;
  `

  export const ItemLeft = styled.div`
    display: flex;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 2.1rem;
    color: #787878;
    margin-right: 2.0rem;
  `
  export const ItemRight = styled(ItemLeft)`
    color: #9A9A9A;
    font-weight: 500;
    flex: 1;
    overflow-wrap: anywhere;
  `


}
