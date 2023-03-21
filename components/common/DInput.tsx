'use client' 


import { StandardTextFieldProps, TextField } from '@mui/material'
import * as React from 'react' 


interface DInputProps extends StandardTextFieldProps {
    number?: boolean
} 

export const DInput: React.FC<DInputProps> = (props) => {

    const {sx, inputProps, number, fullWidth, ...rest} = props

    return (
        <TextField
            variant='standard' 
            sx={{ fontFamily: 'sans-serif', fontWeight: 'light', ...sx }}
            inputProps={{ ...inputProps,  ...(number ? {inputMode: 'numeric', pattern: '[0-9]*'} : {})}} 
            fullWidth={fullWidth ?? true}
            {...rest}
        />
    )
}