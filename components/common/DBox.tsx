'use client'

import * as React from 'react'
import { Box, BoxProps } from '@mui/material' 
import { styles } from 'lib/constants'


interface DBoxProps extends BoxProps {
    sx?: any
} 

export const DBox: React.FC<DBoxProps> = (props) => {
    return (
       <Box sx={{ ...styles, margin: 0, width: '100%', ...props.sx }}>
        {props.children}
       </Box>
    )
}

