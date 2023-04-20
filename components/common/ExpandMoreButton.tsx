import { KeyboardArrowRightSharp } from '@mui/icons-material';
import { IconButtonProps, IconButton, styled } from '@mui/material';
import * as React from 'react';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const StyledExpandMoreButton = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const ExpandMoreButton = React.forwardRef((props: ExpandMoreProps, ref: React.ForwardedRef<HTMLButtonElement>) => (
  <StyledExpandMoreButton {...props} ref={ref}>
    <KeyboardArrowRightSharp />
  </StyledExpandMoreButton>
));
