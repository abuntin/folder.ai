'use client'


import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material'
import { margin } from 'lib/magic'
import { labels, values, headings, countries } from './text';
import { DText, CountrySelect } from 'components'
import * as React from 'react' 
import { NewDealContext } from '.';


interface SecondaryPartyPageProps {
    state?: { name: string, country: string }
} 

const key = 'secondaryPartyPage'

const { [key]: { heading, subheading, info } } = headings;
const { [key]: { name: nameLabel, country: countryLabel } } = labels;
const { [key]: { name: nameValue, country: countryValue } } = values;

export const SecondaryPartyPage: React.FC<SecondaryPartyPageProps> = ({ state }) => {

    const defaultFields = {
        name: state?.name ?? '',
        country: state?.country ?? { code: 'gb', label: 'United Kingdom' }
    } 

    const keys = Object.keys(defaultFields)

    const [fields, setFields] = React.useState(defaultFields);

    const [otherPerson, setOtherPerson] = React.useState(false)

    const { save } = React.useContext(NewDealContext)

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
            <Grid item xs={12} sx={{ mb: margin }}>
                <FormControlLabel
                    control={<Checkbox value={otherPerson} onChange={e => setOtherPerson(e.target.checked)} color='primary'/>}
                    label={<DText text={info} variant='caption' />}
                    labelPlacement='end'
                />
            </Grid>
        </Grid>
       
    )
} 