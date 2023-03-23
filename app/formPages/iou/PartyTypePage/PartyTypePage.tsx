'use client'


import { Unstable_Grid2 as Grid, RadioGroup } from '@mui/material'
import { margin } from 'lib/constants'
import { key, keys, headings } from './text';
import { DText, OptionLabel } from 'components'
import * as React from 'react' 
import { useNewDealDispatch, useNewDealSelector } from '../..';
import { FormOptionType, LoanPartyType } from 'lib/types';


interface PartyTypePageProps {}

const { heading, subheading } = headings;
const { options } = keys;

export const PartyTypePage: React.FC<PartyTypePageProps> = () => {

    const { [key]: state, primaryPartyPage: { name } } = useNewDealSelector(state => state)

    const dispatch = useNewDealDispatch()

    const [selected, setSelected] = React.useState(state)

    const handleChange = (e: any, option: FormOptionType) => {
        setSelected(selected)

        dispatch({ [key]: option.value as LoanPartyType })
    }

    return (
        <Grid container spacing={4}>
            <Grid xs>
                <DText text={name === '' ? heading : `${name} is the...`} variant='h5' />
            </Grid>
            {subheading !== '' && 
               <Grid xs sx={{ mb: margin }}>
                <DText text={subheading} variant='body1' />
            </Grid>
          }
            <Grid xs>
                <RadioGroup>
                    <Grid container spacing={4}>
                        {options.map((option, i) => {
                            return (
                                // TODO: Add tooltips to options via option.description
                                <Grid key={i} xs>
                                    <OptionLabel option={option} onChange={e => handleChange(e, option)} />
                                </Grid>
                                
                            )
                        })}
                    </Grid>
                </RadioGroup>  
            </Grid> 
        </Grid>
       
    )
} 

