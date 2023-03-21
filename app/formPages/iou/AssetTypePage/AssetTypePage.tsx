'use client'


import { Grid, InputAdornment, RadioGroup } from '@mui/material'
import { margin } from 'lib/magic'
import { key, keys, headings, labels } from './text';
import { DText, DAutocomplete, OptionLabel, DInput } from 'components'
import * as React from 'react' 
import { useNewDealDispatch, useNewDealSelector } from '../..';
import { FormOptionType } from 'lib/types';


interface AssetTypePageProps {}

const { heading, subheading } = headings;
const { amount: amountKey, details: detailsKey, type: typeKey } = keys;
const { amount: amountLabel, details: detailsLabel, type: typeLabel } = labels

export const AssetTypePage: React.FC<AssetTypePageProps> = () => {

    const { [key]: state } = useNewDealSelector(state => state)

    const dispatch = useNewDealDispatch()

    const [fields, setFields] = React.useState(state)

    const { amount, type, details } = fields

    const handleChange = (e: any, field: string, newVal?: any) => {
        const newFields = { ...fields, [field]: newVal ?? e.target.value } 
        setFields(newFields) 
        dispatch({ [key]: newFields })
   }

    return (
        <Grid container spacing={4}>
            {heading !== '' && 
                 <Grid item xs={12}>
                    <DText text={heading} variant='h5' />
                </Grid>
            }
            {subheading !== '' && 
             <Grid item xs={12} sx={{ mb: margin }}>
                <DText text={subheading} variant='body1' />
            </Grid>
          }        
            <Grid item xs={12}>
                <DText text={typeLabel} variant='body2' />
            </Grid>    
            <Grid item xs={12}>
                <DAutocomplete<FormOptionType> 
                    options={typeKey.options} 
                    value={type} 
                    onChange={(e, newVal) => handleChange(e, typeKey.value, newVal ?? undefined)} 
                />
            </Grid>
            <Grid item xs={12}>
                <DText text={amountLabel} variant='body2' />
            </Grid>
            <Grid item xs={12} sx={{ mb: margin * 2 }}>
                <DInput
                    placeholder={amountLabel}
                    value={amount}
                    onChange={e => handleChange(e, amountKey)}
                    number
                    InputProps={{ startAdornment: <InputAdornment position="start"><DText text='£' /> </InputAdornment>}}
                />
            </Grid>
            <Grid item xs={12} sx={{ mb: margin }}>
                <DInput
                    placeholder='(E.g. Plot no. 13579, Alphabet Class A shares)'
                    value={details}
                    onChange={e => handleChange(e, detailsKey)}
                    multiline
                    rows={2}
                />
            </Grid>
        </Grid>
       
    )
} 