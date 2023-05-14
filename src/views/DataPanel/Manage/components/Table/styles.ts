import styled from "styled-components";

export namespace TableStyles {
  export const Table = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    border-radius: 1.8rem;
  `

  export const TableHead = styled.div`
    display: grid;
    height: 8.8rem;
    grid-template-columns: 1fr 1.5fr 1.45fr 2fr 3fr;
    border-bottom: .1rem solid rgba(200, 211, 245, 0.5);
    padding-left: 3.9rem;
  `

  export const NonTableHeadItemWrapper = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;

  `
  export const TableHeadItem = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 1.8rem;
    color: #787878;
  `

  export const NonTableItem = styled.div`
    display: flex;
    background: url("/img_7.png") no-repeat center;
    background-size: contain;
    width: 100%;
    height: 100%;
  `


  export const StateWrap = styled.div`
    padding: 1.0rem 0;
  `

  export const StateWrapTop = styled.div`
    height: 50%;
    display: flex;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 1.5rem;
    color: #2C2C2C;
  `

  export const StateWrapBottom = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 1rem;
    height: 50%;
    display: flex;
    align-items: center;
    color: #AFAFAF;
  `

  export const CapacityWrap = styled.div`
    padding: 2rem 0;
  `
  export const CapacityWrapTop = styled.div`
    width: 15.0rem;
    height: .6rem;
    background: linear-gradient(270deg, #7ADEF9 0%, #B1EAA3 100%);;
    border-radius: 14.184 .3rem;
  `

  export const CapacityWrapBottom = styled.div`
    height: 1.8rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.5rem;
    color: #7D7AB3;
    display: flex;
    align-items: center;
  `

  export const TableItemText = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 1.5rem;
    color: #2C2C2C;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 1rem;
  `

  export const UpgradeWrap = styled.div<{ isNotClick?: boolean }>`
    height: 3.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #3FCA6E;
    border-radius: 3.0rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 1.8rem;
    color: #FFFFFF;
    cursor: pointer;

    :hover {
      transition: all 0.25s;
      opacity: ${({isNotClick}) => isNotClick ? 1 : 0.6}; // 0.6;
      box-shadow: 0.2rem 0.2rem 0.8rem 0.2rem rgba(0, 0, 0, 0.3);
    }

  `

  export const ManageWrap = styled(UpgradeWrap)`
    width: 13.2rem;
    height: 3.7rem;
    background: #72A4F0;
    display: flex;
    padding: 0 1.5rem;
    justify-content: space-around;
  `

  export const ActionButtonWrapper = styled.div`
    display: grid;
    height: 100%;
    align-items: center;
    grid-template-columns: 1.6fr 1.5fr 1fr;
    grid-column-gap: 0.5rem;
  `

  export const Test_Table_Item = styled.div`
    display: grid;
    height: 8.7rem;
    position: relative;
    align-items: center;
    grid-template-columns: 1fr 1.5fr 1.45fr 2fr 3fr;
    border-bottom: .1rem solid rgba(200, 211, 245, 0.5);
    padding-left: 3.9rem;
    cursor: pointer;

    :hover {
      background-color: rgba(200, 211, 245, 0.1);
    }
  `

  export const MoreButton = styled.div`
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    transition: all 0.2s;

    :hover {
      background-color: rgba(211, 211, 211, 0.3);
    }

  `

}
