'use client'


import { Grid } from '@mui/material'
import { key, labels, keys, headings } from './text';
import { countries } from 'lib/countries';
import { margin } from 'lib/magic';
import { DText, CountrySelect, DInput } from 'components'
import * as React from 'react' 
import { useNewDealSelector, useNewDealDispatch } from '../..';
import { motion } from 'framer-motion';


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
                    onChange={(e, newVal) => handleChange(e, countryKey, newVal?.code ?? undefined)} 
                    options={countries} 
                />
            </Grid>
            <Grid item xs={12}>
                {(fields.country && fields.country.code !== '' &&  fields.name !== '') ? (
                    <motion.div
                        initial={{ opacity: 0, y: '-200%' }}
                        animate={{ opacity: 1, y: '0%' }}
                        exit={{ opacity: 0.5, y: '200%'}}
                        transition={{
                            duration: 0.45,
                            ease: [0, 0.71, 0.2, 1.01]
                        }}
                    >
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
                    </motion.div>
                ) : null}
            </Grid>
            <Grid item xs={12}>
                <DText text={info} variant='caption' />
            </Grid>
            
        </Grid>
       
    )
}