import React from 'react';
import {ToastTextWrap} from "@/styles";
import {desensitizationPrincipal} from "@/utils/formate";
import {ReactJSXElement} from '@emotion/react/types/jsx-namespace';

export const ToastState = ({fileName, children}: { fileName: string, children: ReactJSXElement }) => {
  return <ToastTextWrap>
    <div style={{color: "#4E4597"}}>
      {fileName.length > 10 ? desensitizationPrincipal(fileName, 4) : fileName}
    </div>
    {children}
  </ToastTextWrap>
}

