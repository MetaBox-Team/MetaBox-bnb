import React from "react";
import { TextAreaWrap } from "./styles";
import { TextareaAutosize, TextareaAutosizeProps } from "@mui/material";
import "./index.css";
interface Props {
    minRows?: number;
    onChange: (e) => void;
}
export const TextArea = ({ minRows, onChange }: Props) => {
    return (
        <TextAreaWrap>
            <TextareaAutosize
                style={{
                    resize: "none",
                    width: "100%",
                }}
                onChange={(e) => onChange(e)}
                minRows={minRows ? minRows : 1}
            />
        </TextAreaWrap>
    );
};
