import { FormControlLabelProps, FormControlLabel, Radio } from '@mui/material'
import { FormOptionType } from 'lib/types'
import * as React from 'react'
import { DRadio } from './DRadio'
import { DText } from './DText'


interface OptionLabelProps extends Partial<FormControlLabelProps> { 
    option: FormOptionType
}
    
export const OptionLabel: React.FC<OptionLabelProps> = ({ option }) => (
    <FormControlLabel
        color='primary'
        value={option.value} 
        label={<DText text={option.label} variant='body2' />}
        control={<DRadio />}
    />
)