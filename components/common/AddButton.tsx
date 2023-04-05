'use client' 


import { Box, IconButton, IconButtonProps } from '@mui/material'
import { AddSharp } from '@mui/icons-material'
import * as React from 'react' 


export const AddButton: React.FC<IconButtonProps> = (props) => {
    return (
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
            <IconButton {...props}>
                <AddSharp sx={{ fontSize: 20 }} color='disabled' />
            </IconButton>
        </Box>
        
    )
}