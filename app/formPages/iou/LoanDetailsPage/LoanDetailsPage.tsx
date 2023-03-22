'use client'


import { Grid, InputAdornment, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AppearAnimation, DateInput, DAutocomplete, DInput, DText } from 'components';
import { margin } from 'lib/magic'
import dayjs from 'dayjs';
import { FormOptionType } from 'lib/types';
import * as React from 'react';
import { useNewDealDispatch, useNewDealSelector } from '../..';
import { frequencyOptions, headings, key, keys, labels } from './text';


interface LoanDetailsPageProps {}

const  { heading, subheading, info } = headings;
const { interest: interestLabel, repaymentFrequency: repaymentFrequencyLabel, loanDate: loanDateLabel } = labels;
const {
    loanDate: loanDateKey,
    repaymentFrequency: repaymentFrequencyKey,
    interest: { 
        value: interestKey, 
        rate: rateKey, 
        type: { value: typeKey, options: [compoundKey, fixedKey] }, 
        frequency: interestFrequencyKey, 
    } } = keys;

export const LoanDetailsPage: React.FC<LoanDetailsPageProps> = (props) => {

    const { [key]: state, assetTypePage: { amount } } = useNewDealSelector(state => state)

    const dispatch = useNewDealDispatch()

    const [fields, setFields] = React.useState(state)

    let { interest, loanDate, repaymentFrequency } = fields

    let { rate, type, frequency } = interest

    const handleChange = (e: any, field: string, newVal?: any) => {
          const newFields = { ...fields, [field]: newVal ?? e.target.value } 
          setFields(newFields) 
          dispatch({ [key]: newFields })
     }

    const [helperText, setHelperText] = React.useState('')

    React.useEffect(() => {

        if (rate !== 0 && amount !==0) {

            if (type === 'fixed')
                setHelperText(`£${rate * amount * 0.01} ${frequency}`)
            
            else setHelperText(`£ ${amount * (1 + (rate * 0.01))} to ${amount * Math.pow(1 + (rate * 0.01), 10)}+, ${frequency}`)
        
        }

        else setHelperText('')

    }, [fields[interestKey]])

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
                <DText text={loanDateLabel} variant='body2' />
            </Grid>
            <Grid item xs={12}>
                <DateInput onAccept={value => handleChange(null, loanDateKey, value?.toISOString() ?? '')} value={dayjs(loanDate)} />
            </Grid>
            <Grid item xs={12}>
                <DText text={interestLabel} variant='body2' />
            </Grid>
            <Grid item xs={12}>
                <DInput
                    placeholder={rateKey.charAt(0).toUpperCase() + rateKey.slice(1)}
                    value={rate}
                    onChange={e => handleChange(e, interestKey, { ...interest, rate: e.target.value })}
                    number
                    InputProps={{ startAdornment: <InputAdornment position="start"><DText text='%' /></InputAdornment>}}
                />
            </Grid>
            <Grid item xs={12}>
                <ToggleButtonGroup
                    value={type}
                    exclusive
                    onChange={(e, newVal) => handleChange(e, interestKey, { ...interest, [typeKey]: newVal })}
                >
                    <ToggleButton value={fixedKey}>
                        <DText text={fixedKey.charAt(0).toUpperCase() + fixedKey.slice(1)} variant='body2' />
                    </ToggleButton>
                    <ToggleButton value={compoundKey}>
                        <DText text={compoundKey.charAt(0).toUpperCase() + compoundKey.slice(1)} variant='body2' />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} sx={{ mb: margin }}>
                {rate !== 0 &&
                    <AppearAnimation>
                        <DAutocomplete<FormOptionType>
                            options={frequencyOptions}
                            value={frequency}
                            onChange={(e, newVal) => handleChange(e, interestFrequencyKey, newVal ?? undefined)}
                        />
                    </AppearAnimation>
                }
            </Grid>
            <Grid item xs={12}>
                <DText text={repaymentFrequencyLabel} variant='body2' />
            </Grid>
            <Grid item xs={12}>
                <DAutocomplete<FormOptionType> 
                    options={frequencyOptions} 
                    value={repaymentFrequency}
                    onChange={(e, newVal) => handleChange(e, repaymentFrequencyKey, newVal ?? undefined)}
                />
            </Grid>
            {helperText !== '' &&
                (<Grid item xs={12}>
                    <DText text={helperText} variant='h6' fontStyle='italic' />
                </Grid>)
            }
            <Grid item xs={12}>
                <DText text={info} variant='caption' />
            </Grid> 
        </Grid>
       
    )
} 