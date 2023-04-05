'use client' 


import * as React from 'react' 
import { Checkbox, CheckboxProps } from '@mui/material'

export const DCheckbox: React.FC<CheckboxProps> = (props) => {

    const { sx, ...rest } = props

    return (
        <Checkbox sx={{
            color: 'grey',
            '&.Mui-checked': {
              color: 'primary',
            },
            ...sx,
        }} {...rest}/>
    )
}