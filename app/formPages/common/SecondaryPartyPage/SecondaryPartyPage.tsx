'use client'

import { Checkbox, FormControlLabel, Grid } from '@mui/material'
import { CSSTransition } from 'react-transition-group'
import { margin } from 'lib/magic'
import { key, labels, keys, headings } from './text';
import { DText, CountrySelect, DInput, DCheckbox } from 'components'
import * as React from 'react' 
import {  useNewDealDispatch, useNewDealSelector } from '../..';
import { countries } from 'lib/countries';


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

    const nodeRef = React.useRef<HTMLDivElement>(null)

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
            <Grid item xs={12} sx={{ mb: margin * 2 }}>
                <DInput
                    placeholder={nameKey.charAt(0).toUpperCase() + nameKey.slice(1)} 
                    value={name} 
                    onChange={e => handleChange(e, nameKey)}               
                />
            </Grid>
            <Grid item xs={12}>
                <DText text={countryLabel} variant='body2' />
            </Grid>
            <Grid item xs={12} sx={{ mb: margin }}>
                <CountrySelect 
                    value={country} 
                    onChange={(e, newVal) => handleChange(e, countryKey, newVal?.code ?? undefined)} 
                    options={countries} 
                />
            </Grid>
            <Grid item xs={12} sx={{ mb: margin * 2 }}>
                <CSSTransition
                    in={(fields.country.code !== '' &&  fields.name !== '')}
                    nodeRef={nodeRef}
                    classNames="hideshow"
                    addEndListener={done => nodeRef?.current?.addEventListener('transitionend', done, false)}
                >
                    <div ref={nodeRef}>
                        {(fields.country.code !== '' &&  fields.name !== '') &&
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
                        }
                    </div>
                </CSSTransition>
            </Grid>
            <Grid item xs={12} sx={{ mb: margin }}>
                <FormControlLabel
                    control={<DCheckbox value={otherPerson} onChange={e => setOtherPerson(e.target.checked)} />}
                    label={<DText text={info} variant='caption' />}
                    labelPlacement='end'
                />
            </Grid>
        </Grid>
       
    )
} 