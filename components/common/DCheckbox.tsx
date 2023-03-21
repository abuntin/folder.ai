'use client' 


import * as React from 'react' 
import { Checkbox, CheckboxProps } from '@mui/material'

interface DCheckboxProps extends CheckboxProps {
    
} 

export const DCheckbox: React.FC<DCheckboxProps> = (props) => {

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