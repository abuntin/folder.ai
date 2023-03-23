'use client'


import { FormControlLabel, Grid } from '@mui/material'
import { margin } from 'lib/magic'
import { key, keys, headings, labels } from './text';
import { AppearAnimation, DText, DCheckbox, DInput } from 'components'
import * as React from 'react' 
import { useNewDealDispatch, useNewDealSelector } from '../..';


interface CosignPageProps {}

const { heading, subheading, info } = headings;
const { name: nameKey, address: addressKey, city: cityKey } = keys;
const { name: nameLabel, address: addressLabel } = labels;

export const CosignPage: React.FC<CosignPageProps> = () => {

    const { [key]: state } = useNewDealSelector(state => state)

    const dispatch = useNewDealDispatch()

    const [fields, setFields] = React.useState(state)

    const { isCosigned, name, address, city } = fields;

    const handleChange = (e: any, field: string, newVal?: boolean) => {
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
            <Grid item xs={12}>
                <FormControlLabel
                    control={<DCheckbox value={isCosigned} onChange={e => handleChange(e, 'isCosigned', e.target.checked)} />}
                    label={<DText text={subheading} variant='body1' />}
                    labelPlacement='end'
                />
            </Grid>
            <Grid item xs={12}>
                {isCosigned &&
                    <AppearAnimation>
                        <Grid container spacing={4}>
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
                }
            </Grid>
            <Grid item xs={12}>
                <DText text={info} variant='caption' />
            </Grid>
            
        </Grid>
       
    )
} 