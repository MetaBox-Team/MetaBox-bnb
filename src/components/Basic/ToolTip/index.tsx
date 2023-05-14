import React from 'react';
import {styled} from '@mui/material/styles';
import Tooltip, {TooltipProps, tooltipClasses} from '@mui/material/Tooltip';
import './index.less'


const BootstrapTooltip = styled(({className, ...props}: TooltipProps) => (
  <Tooltip {...props} arrow classes={{popper: className}}/>
))(({theme}) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));


export const ToolTip = React.memo(({children, title}: { children: JSX.Element, title: string }) => {
  return (
    <div>
      <BootstrapTooltip className='toolTip-bot' title={title} placement='top'>
        {children}
      </BootstrapTooltip>
    </div>
  );
})
