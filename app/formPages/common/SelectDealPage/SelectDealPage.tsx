'use client' 


import { Grid } from '@mui/material'
import { margin, padding } from 'lib/constants'
import { DGrid, DBox, DText } from 'components'
import { DealType, FormOptionType } from 'lib/types'
import * as React from 'react' 
import { headings, keys, key } from './text'
import { useNewDealDispatch } from '../..'



interface SelectDealPageProps {
} 


const { heading, subheading } = headings;

const { options } = keys;

export const SelectDealPage: React.FC<SelectDealPageProps> = (props) => {

    const dispatch = useNewDealDispatch()
    
    const handleChange = (e: any, option: FormOptionType) => {
        dispatch({ [key]: option.value as DealType })
    }

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <DText text={heading} variant='h5' sx={{ marginBottom: margin * 2 }}/>
            </Grid>
            {subheading !== '' && 
             <Grid item xs={12} sx={{ mb: margin }}>
                <DText text={subheading} variant='body1' />
            </Grid>
          }
            <Grid item xs={12}>
            <DBox sx={{ padding }}>
                <DGrid options={options} onChange={handleChange} />
            </DBox>
            </Grid>
        </Grid>
)
}

