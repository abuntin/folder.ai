'use client'

import { FormControlLabel, Grid } from '@mui/material';
import { CountrySelect, DCheckbox, DInput, DText, AppearAnimation } from 'components';
import { margin } from 'lib/constants';
import * as React from 'react';
import { useNewDealDispatch, useNewDealSelector } from '../..';
import { headings, key, keys, labels } from './text';


interface SecondaryPartyPageProps {}



const { heading, subheading, info } = headings;
const { name: nameLabel, country: countryLabel, address: addressLabel } = labels;
const { name: nameKey, country: countryKey, address: addressKey, city: cityKey } = keys;

export const SecondaryPartyPage: React.FC<SecondaryPartyPageProps> = (props) => {

    const { [key]: state } = useNewDealSelector(state => state)

    const dispatch = useNewDealDispatch()

    const [fields, setFields] = React.useState(state)

    const { country, name, address, city } = fields

    const [otherPerson, setOtherPerson] = React.useState(false)

    const handleChange = (e: any, field: string, newVal?: string) => {
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
                <DText text={nameLabel} variant='body2' />
            </Grid>
            <Grid item xs={12}>
                <DInput
                    placeholder={nameKey.charAt(0).toUpperCase() + nameKey.slice(1)} 
                    value={name} 
                    onChange={e => handleChange(e, nameKey)}               
                />
            </Grid>
            <Grid item xs={12}>
                <DText text={countryLabel} variant='body2' />
            </Grid>
            <Grid item xs={12}>
                <CountrySelect 
                    value={country ?? { code: '', label: ''}}
                    onChange={(e, newVal) => handleChange(e, countryKey, newVal ?? undefined)}
                />
            </Grid>
            <Grid item xs={12}>
                {(fields.country  &&  fields.name !== '') ? (
                    <AppearAnimation>
                         <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <DText text={addressLabel} variant='body2' />
                                </Grid>
                                <Grid item xs={12}>
                                    <DInput
                                        placeholder={`${addressKey.charAt(0).toUpperCase() + addressKey.slice(1)} & Postcode`}
                                        value={address}
                                        onChange={e => handleChange(e, addressKey)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <DInput
                                        placeholder={cityKey.charAt(0).toUpperCase() + cityKey.slice(1)}
                                        value={city}
                                        onChange={e => handleChange(e, cityKey)}
                                    />
                                </Grid>
                            </Grid>
                    </AppearAnimation>
                ) : null}
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    control={<DCheckbox value={otherPerson} onChange={e => setOtherPerson(e.target.checked)} />}
                    label={<DText text={info} variant='caption' />}
                    labelPlacement='end'
                />
            </Grid>
        </Grid>
       
    )
} 