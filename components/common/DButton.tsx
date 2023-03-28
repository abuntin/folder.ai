'use client' 


import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { Button, ButtonProps } from '@mui/material'
import * as React from 'react' 


interface DButtonProps extends ButtonProps {
    direction?: 'forward' | 'back'
} 

export const DButton: React.FC<DButtonProps> = (props) => {

    const {children, ...rest} = props;

    const { direction, variant = 'outlined' } = rest;

    return (
        <Button 
            startIcon={(direction && direction === 'back') ? <ArrowBackIos fontSize='small' /> : undefined} 
            endIcon={(direction && direction === 'forward') ? <ArrowForwardIos fontSize='small'/> : undefined}
            variant={variant} 
            {...rest}
        > 
            {children} 
        </Button>
    )
}


