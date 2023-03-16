'use client' 


import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { Button, ButtonProps, useTheme } from '@mui/material'
import * as React from 'react' 


interface DButtonProps extends ButtonProps {
    nav?: boolean,
    direction?: 'forward' | 'back'
} 

export const DButton: React.FC<DButtonProps> = (props) => {

    const theme = useTheme()

    const {children, ..._props} = props;

    const { nav, direction, variant = 'outlined' } = _props;

    return (
        <Button 
            startIcon={(nav && direction && direction === 'back') ? <ArrowBackIos fontSize='small' /> : undefined} 
            endIcon={(nav && direction && direction === 'forward') ? <ArrowForwardIos fontSize='small'/> : undefined}
            variant={variant} 
            {..._props}
        > 
            {children} 
        </Button>
    )
}