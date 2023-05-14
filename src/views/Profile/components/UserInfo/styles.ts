import styled from "styled-components";

export namespace UserInfoStyles {
  export const ContentWrap = styled.div`
    display: flex;
    flex-direction: column;
  `

  export const Avatar = styled.div<{ url?: string }>`
    min-width: 18rem;
    min-height: 18rem;
    max-width: 18rem;
    max-height: 18rem;
    background: #D9D9D9;
    border-radius: 50%;
    background: url(${({url}) => url ? url : "/avatar.jpg"}) no-repeat center center;
    background-size: cover;
  `
  export const InfoWrap = styled.div`
    padding-left: 5.0rem;
    display: flex;
    flex-direction: column;
  `
  export const IDWrap = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
  `
  export const FollowInfoWrap = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
  `
  export const DataInfoWrap = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: right;
    flex-grow: 0;
    padding-bottom: 4.0rem;
  `
  export const UserNameWrap = styled.div`
    display: flex;
    flex-direction: row;
    height: 5.8rem;
    align-items: center;
  `
  export const Gap = styled.div`
    padding-left: 4.5rem;
  `
  export const Text_UserName = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 4rem;
    color: #4E4597;
  `
  // export const Text_M = styled.div<{ x: Number; y: Number }>`
  export const Text_M = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 3rem;
    color: #000000;
    padding-right: 1.0rem;
  `
  // export const Text_S = styled.div<{ x: Number; y: Number }>`
  export const Text_S = styled.div`
    font-family: 'Inter_Light';
    font-style: normal;
    font-weight: 500;
    font-size: 2rem;
    color: #787878;
    padding-right: 1.0rem;
  `
  // export const Text_S_P = styled.div<{ x: Number; y: Number; w?: Number }>`
  export const Text_S_P = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 2.1rem;
    color: #4E4597;
  `
  // export const Text_SS = styled.div<{ x: Number; y: Number; w?: Number}>`
  export const Text_SS = styled.div`
    font-family: 'Inter_Light';
    font-style: normal;
    font-weight: 400;
    font-size: 1.8rem;
    color: #787878;
    padding-right: 1.0rem;
    width: 100%;
    max-height: 22.1rem;
    overflow: hidden;
  `

  export const Main = styled.div`
    flex: 1;
    display: flex;
    padding-bottom: 5.0rem;
  `
}
