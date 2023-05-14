import React from "react";
import {InputWrap} from "./styles";
import "./index.css";

interface Props {
  placeholder?: string;
  onChange: (e: any) => void;
  style?: React.CSSProperties;
  onBlur?: Function;
  error?: boolean;
  type?: string;
  value?: any
  id?: string
}

export const Input_2 = React.memo(({
                                     placeholder,
                                     onChange,
                                     style,
                                     onBlur,
                                     error,
                                     type,
                                     value,
                                     id
                                   }: Props) => {
    return (
      <InputWrap style={{...style}} error={error}>
        <input
          id={id}
          type={type}
          value={value}
          onBlur={() => onBlur?.()}
          placeholder={placeholder}
          style={{height: "100%", width: "100%"}}
          onChange={(e) => onChange(e)}
        />
      </InputWrap>
    );
  }
)
