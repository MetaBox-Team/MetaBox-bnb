import React from "react";
import {ButtonStyles as Styled} from "./styles";

interface Props {
    height?: string;
    width?: string;
    children: React.ReactNode;
    disabled?: boolean;
    size?: number;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export const Button =
    ({
         height,
         width,
         children,
         disabled,
         size,
         onClick,
         style
     }: Props) => {
        return (
            <Styled.ButtonWrap
                style={{...style}}
                height={height}
                width={width}
                disabled={disabled}
                size={size}
                onClick={onClick}
            >
                {children}
            </Styled.ButtonWrap>
        );
    };
