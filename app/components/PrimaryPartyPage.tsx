'use client'


import { Grid, TextField } from '@mui/material'
import { margin } from 'lib/magic'
import { labels, values, headings, countries } from './text';
import { DText, CountrySelect } from 'components'
import * as React from 'react' 
import { NewDealContext } from '.';


interface PrimaryPartyPageProps {
    state?: { name: string, country: string }
} 

const key = 'primaryPartyPage'

const { [key]: { heading, subheading, info } } = headings;
const { [key]: { name: nameLabel, country: countryLabel }} = labels;
const { [key]: { name: nameValue, country: countryValue } } = values;

export const PrimaryPartyPage: React.FC<PrimaryPartyPageProps> = ({ state }) => {

    const defaultFields = {
        name: state?.name ?? '',
        country: state?.country ?? countryValue,
    } 

    const keys = Object.keys(defaultFields)

    const { save } = React.useContext(NewDealContext)

    const [fields, setFields] = React.useState(defaultFields);

    const handleChange = (e: any, field: string, newVal?: string) => {
        setFields({ ...fields, [field]: newVal ?? e.target.value })

        save(key, fields)
    }

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <DText text={heading} variant='h5' />
            </Grid>
            <Grid item xs={12} sx={{ mb: margin }}>
                <DText text={subheading} variant='body1' />
            </Grid>
            <Grid item xs={12}>
                <DText text={nameLabel} variant='body2' />
            </Grid>
            <Grid item xs={12} sx={{ mb: margin * 2 }}>
                <TextField
                    variant='standard'
                    sx={{ fontFamily: 'sans-serif', fontWeight: 'light' }}
                    placeholder={nameValue.charAt(0).toUpperCase() + nameValue.slice(1)}
                    value={fields[nameValue]}
                    onChange={e => handleChange(e, keys[0])}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <DText text={countryLabel} variant='body2' />
            </Grid>
            <Grid item xs={12} sx={{ mb: margin }}>
                <CountrySelect onChange={(e, newVal) => handleChange(e, keys[1], newVal?.code ?? undefined)} options={countries} />
            </Grid>
            <Grid item xs={12}>
                <DText text={info} variant='caption' />
            </Grid>
            
        </Grid>
       
    )
} 