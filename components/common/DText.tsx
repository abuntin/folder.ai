'use client' 

import * as React from 'react'
import { Typography, TypographyProps } from '@mui/material'


interface DTextProps extends TypographyProps {
    text: string | React.ReactNode,
    code?: boolean
} 

export const DText: React.FC<DTextProps> = (props) => {

    const { text, code = false } = props;

    return (
       <Typography fontFamily='sans-serif' fontWeight={code ? 'medium' : 'light'} gutterBottom={code} color='text.primary' {...props}> {text} </Typography>
    )
}

