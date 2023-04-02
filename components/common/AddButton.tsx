'use client' 


import { IconButton, IconButtonProps, styled } from '@mui/material'
import { AddSharp } from '@mui/icons-material'
import { DText } from 'components'
import * as React from 'react' 


interface AddButtonProps extends IconButtonProps {
    
} 

export const AddButton: React.FC<AddButtonProps> = (props) => {
    return (
       <IconButton {...props}>
        <AddSharp fontSize='large' />
       </IconButton>
    )
}