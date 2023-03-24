'use client'


import { Unstable_Grid2 as Grid } from '@mui/material'
import { key, labels, keys, headings } from './text';
import { margin } from 'lib/constants';
import { DText, CountrySelect, DInput, AppearAnimation } from 'components'
import * as React from 'react' 
import { useNewDealSelector, useNewDealDispatch } from '../..';


interface PrimaryPartyPageProps {}



const { heading, subheading, info } = headings;
const { name: nameLabel, country: countryLabel, address: addressLabel } = labels;
const { name: nameKey, country: countryKey, address: addressKey, city: cityKey } = keys;

export const PrimaryPartyPage: React.FC<PrimaryPartyPageProps> = (props) => {

    const { [key]: state } = useNewDealSelector(state => state)

    const dispatch = useNewDealDispatch()

    const [fields, setFields] = React.useState(state)

    const { name, country, address, city } = fields

    const handleChange = (e: any, field: string, newVal?: string) => {
          const newFields = { ...fields, [field]: newVal ?? e.target.value } 
          setFields(newFields) 
          dispatch({ [key]: newFields })
    }

    return (
         <Grid container spacing={5} direction='column'>
            {heading !== '' && 
                 <Grid xs={12}>
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
                    placeholder={nameKey.charAt(0).toUpperCase() + nameKey.slice(1)} 
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
                                        placeholder={`${addressKey.charAt(0).toUpperCase() + addressKey.slice(1)} & Postcode`}
                                        value={address}
                                        onChange={e => handleChange(e, addressKey)}
                                    />
                                </Grid>
                                <Grid xs>
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
            <Grid xs>
                <DText text={info} variant='caption' />
            </Grid>
            
        </Grid>
       
    )
}