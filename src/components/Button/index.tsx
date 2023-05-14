import React, {MouseEventHandler} from 'react';
import {ButtonStyles as Styled} from "./styles"

interface Props {
  content: any,
  padding: string,
  onClick?: MouseEventHandler<HTMLDivElement>
  style?: React.CSSProperties
  setIsHover?: Function
}

export const NewButton = React.memo(({content, padding, onClick, style, setIsHover}: Props) => {
  return (
    <Styled.ClickButton onMouseEnter={() => setIsHover?.(true)} onMouseLeave={() => setIsHover?.(false)} style={style}
                        onClick={onClick} padding={padding}>
      {content}
    </Styled.ClickButton>
  );
})
