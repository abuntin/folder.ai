'use client' 

import * as React from 'react'
import { Typography, TypographyProps } from '@mui/material'


interface DTextProps extends TypographyProps {
    text: string | React.ReactNode,
} 

export const DText: React.FC<DTextProps> = (props) => {

    const { text } = props;

    return (
       <Typography fontFamily='sans-serif' fontWeight='light' {...props}> {text} </Typography>
    )
}

