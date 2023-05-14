import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Zoom } from "@mui/material";
import "./index.less";

interface Props {
    children: JSX.Element;
    content: JSX.Element;
}

export const ToolTipContent = ({ children, content }: Props) => {
    const [open, setOpen] = React.useState(false);
    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    return (
        <div>
            <Grid item>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <div>
                        <Tooltip
                            PopperProps={{
                                disablePortal: true,
                            }}
                            classes={{ popper: "TooltipsTransaction" }}
                            onClose={handleTooltipClose}
                            open={open}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={content}
                            TransitionComponent={Zoom}
                            arrow
                        >
                            <div onClick={handleTooltipOpen}>{children}</div>
                        </Tooltip>
                    </div>
                </ClickAwayListener>
            </Grid>
        </div>
    );
};
