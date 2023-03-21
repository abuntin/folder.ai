'use client'


import { Grid, Radio, RadioGroup } from '@mui/material'
import { margin } from 'lib/magic'
import { key, keys, headings } from './text';
import { DText, DBox, OptionLabel } from 'components'
import * as React from 'react' 
import { useNewDealDispatch, useNewDealSelector } from '../..';
import { FormOptionType } from 'lib/types';


interface PartyTypePageProps {}

const { heading, subheading } = headings;
const { options } = keys;

export const PartyTypePage: React.FC<PartyTypePageProps> = () => {

    const { [key]: state, primaryPartyPage: { name } } = useNewDealSelector(state => state)

    const dispatch = useNewDealDispatch()

    const [selected, setSelected] = React.useState(state)

    const handleChange = (e: any, option: FormOptionType) => {
        setSelected(selected)

        dispatch({ [key]: option })
    }

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <DText text={name === '' ? heading : `${name} is the...`} variant='h5' />
            </Grid>
            {subheading !== '' && 
             <Grid item xs={12} sx={{ mb: margin }}>
                <DText text={subheading} variant='body1' />
            </Grid>
          }
            <Grid item xs={12} sx={{ mb: margin }}>
                <RadioGroup>
                    <Grid container spacing={4}>
                        {options.map((option, i) => {
                            return (
                                // TODO: Add tooltips to options via option.description
                                <Grid key={i} item xs={12}>
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

