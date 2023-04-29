import { KeyboardArrowRightSharp } from '@mui/icons-material';
import { IconButtonProps, IconButton, styled } from '@mui/material';
import * as React from 'react';

interface ExpandMoreProps extends IconButtonProps {
  expanded: boolean;
  deg?: number;
}

const StyledExpandMoreButton = styled((props: ExpandMoreProps) => {
  const { expanded: expand, deg, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expanded: expand, deg }) => ({
  transform: !expand ? 'rotate(0deg)' : `rotate(${deg ?? 180}deg)`,
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const ExpandMoreButton = React.forwardRef(
  (props: ExpandMoreProps, ref: React.ForwardedRef<HTMLButtonElement>) => (
    <StyledExpandMoreButton {...props} ref={ref}>
      <KeyboardArrowRightSharp />
    </StyledExpandMoreButton>
  )
);
