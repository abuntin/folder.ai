'use client' 


import * as React from 'react' 
import { styled, Divider, DividerProps } from '@mui/material'

interface DividerGradientProps extends DividerProps { active: boolean, hover: boolean }

export const DividerGradient = styled((props: DividerGradientProps) => {
    const { active, hover, ...rest } = props;
    return <Divider sx={{ backgroundColor: 'transparent' }} {...rest} />;
  })(({ theme, active, hover }) => ({
    backgroundColor: (active || hover) ? theme.palette.text.disabled : 'transparent',
    opacity: (active || hover) ? 1 : 0,
    transition: theme.transitions.create(['backgroundColor', 'opacity'], {
      duration: theme.transitions.duration.shortest,
    }),
}));