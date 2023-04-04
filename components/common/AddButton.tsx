'use client' 


import { Box, IconButton, IconButtonProps } from '@mui/material'
import { AddSharp } from '@mui/icons-material'
import { DText } from 'components'
import * as React from 'react' 


interface AddButtonProps extends IconButtonProps {
    
} 

export const AddButton: React.FC<AddButtonProps> = (props) => {
    return (
        <IconButton {...props}>
            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <AddSharp fontSize='medium' />
                <DText text='Add' variant='caption' color='common.white' />
            </Box>
        </IconButton>
    )
}