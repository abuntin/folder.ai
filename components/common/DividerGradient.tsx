'use client' 


import * as React from 'react' 
import { styled, Divider, DividerProps } from '@mui/material'

interface DividerGradientProps extends DividerProps { active: boolean, hover: boolean }

export const DividerGradient = styled((props: DividerGradientProps) => {
    const { active, hover, ...rest } = props;
    return <Divider sx={{ backgroundColor: '#111010' }} {...rest} />;
  })(({ theme, active, hover }) => ({
    backgroundColor: (active || hover) ? theme.palette.text.disabled : theme.palette.text.primary,
    //`linear-gradient(to right, ${theme.palette.background.paper} 0, ${theme.palette.background.paper} 15%, ${theme.palette.primary.main} 15%, ${theme.palette.primary.main} 85%, ${theme.palette.background.paper} 85%, ${theme.palette.background.paper} 100%)`,
    transition: theme.transitions.create('backgroundColor', {
      duration: theme.transitions.duration.standard,
    }),
}));