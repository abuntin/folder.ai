'use client' 


import { Radio, RadioProps } from '@mui/material'
import * as React from 'react' 


interface DRadioProps extends RadioProps {
    
} 

export const DRadio: React.FC<DRadioProps> = (props) => {

    const { sx, ...rest } = props

    return (
        <Radio sx={{
            color: 'grey',
            '&.Mui-checked': {
              color: 'primary',
            },
            ...sx
        }} {...rest} />
    )
}

