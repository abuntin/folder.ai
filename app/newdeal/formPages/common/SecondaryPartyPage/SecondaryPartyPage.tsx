'use client'

import { Unstable_Grid2 as Grid, FormControlLabel } from '@mui/material';
import { CountrySelect, DCheckbox, DInput, DText, AppearAnimation } from 'components';
import { margin } from 'lib/constants';
import { capitalise } from 'lib/functions';
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
         <Grid container spacing={4} direction='column'>
            {heading !== '' && 
                 <Grid xs>
                    <DText text={heading} variant='h5' />
                </Grid>
            }
            {subheading !== '' && 
             <Grid xs sx={{ mb: margin }}>
                <DText text={subheading} variant='body1' />
            </Grid>
          }      
            <Grid xs>
                <DText text={nameLabel} variant='body2' />
            </Grid>
            <Grid xs={12}>
                <DInput
                    placeholder={capitalise(nameKey)}
                    value={name} 
                    onChange={e => handleChange(e, nameKey)}               
                />
            </Grid>
            <Grid xs>
                <DText text={countryLabel} variant='body2' />
            </Grid>
            <Grid xs>
                <CountrySelect 
                    value={country ?? { code: '', label: ''}}
                    onChange={(e, newVal) => handleChange(e, countryKey, newVal ?? undefined)}
                />
            </Grid>
            <Grid xs>
                {(fields.country && fields.name !== '') ? (
                    <AppearAnimation>
                          <Grid container spacing={4} direction='column'>
                                <Grid xs>
                                    <DText text={addressLabel} variant='body2' />
                                </Grid>
                                <Grid xs>
                                    <DInput
                                        placeholder={`${capitalise(addressKey)} & Postcode`}
                                        value={address}
                                        onChange={e => handleChange(e, addressKey)}
                                    />
                                </Grid>
                                <Grid xs>
                                    <DInput
                                        placeholder={capitalise(cityKey)}
                                        value={city}
                                        onChange={e => handleChange(e, cityKey)}
                                    />
                                </Grid>
                            </Grid>
                    </AppearAnimation>
                ) : null}
            </Grid>
            <Grid xs>
                <FormControlLabel
                    control={<DCheckbox value={otherPerson} onChange={e => setOtherPerson(e.target.checked)} />}
                    label={<DText text={info} variant='caption' />}
                    labelPlacement='end'
                />
            </Grid>
        </Grid>
       
    )
} 