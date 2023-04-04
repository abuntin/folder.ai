'use client' 


import { StandardTextFieldProps, TextField, useTheme } from '@mui/material'
import * as React from 'react' 


interface DInputProps extends StandardTextFieldProps {
    number?: boolean
    noTheme?: boolean
} 

export const DInput: React.FC<DInputProps> = (props) => {

    const {sx, inputProps, InputProps, number, fullWidth, noTheme, ...rest} = props
    
    const theme = useTheme()

    return (
        <TextField
            variant='standard'
            sx={{ fontFamily: 'sans-serif', fontWeight: 'light', ...sx }}
            fullWidth={fullWidth ?? true}
            inputProps={{ ...inputProps,  ...(number ? {inputMode: 'numeric', pattern: '[0-9]*'} : {})}}
            color={(noTheme && theme.palette.mode === 'light') ? 'secondary' : undefined}
            {...rest}
        />
    )
}

