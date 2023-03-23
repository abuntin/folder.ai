'use client'


import { Unstable_Grid2 as Grid } from '@mui/material'
import dayjs from 'dayjs'
import { margin } from 'lib/constants'
import { labels, keys, headings, key } from './text';
import { DText, DateInput, DInput } from 'components'
import * as React from 'react' 
import { useNewDealSelector, useNewDealDispatch } from '../..';


interface TermDetailsPageProps {}

const  { heading, subheading, info } = headings;
const { signDate: signDateLabel, termDate: endDateLabel, specialClause: specialClauseLabel } = labels;
const { 
    signDate: signDateKey, 
    termDate: termDateKey, 
    specialClause: specialClauseKey } = keys;

export const TermDetailsPage: React.FC<TermDetailsPageProps> = (props) => {

    const { [key]: state } = useNewDealSelector(state => state)

    const dispatch = useNewDealDispatch()

    const [fields, setFields] = React.useState(state)

    const { signDate, termDate, specialClause } = fields

    const handleChange = (e: any, field: string, newVal?: any) => {
          const newFields = { ...fields, [field]: newVal ?? e.target.value } 
          setFields(newFields) 
          dispatch({ [key]: newFields })
     }

    return (
        <Grid container spacing={4}>
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
                <DText text={signDateLabel} variant='body1' />
            </Grid>
            <Grid xs>
                <DateInput onAccept={value => handleChange(null, signDateKey, value?.toISOString() ?? '')} value={dayjs(signDate)} />
            </Grid>
            <Grid xs>
                <DText text={endDateLabel} variant='body1' />
            </Grid>
            <Grid xs>
                <DateInput onAccept={value => handleChange(null, termDateKey, value?.toISOString() ?? '')} value={dayjs(termDate)} minDate={dayjs(signDate === '' ? undefined : signDate)} />
            </Grid>
            <Grid xs>
                <DText text={specialClauseLabel} variant='body1' />
            </Grid>
            <Grid xs>
                <DInput
                    placeholder='Your best writing please!'
                    value={specialClause}
                    onChange={e => handleChange(e, specialClauseKey)}
                    multiline
                    rows={2}
                />
            </Grid>
            <Grid xs>
                <DText text={info} variant='caption' />
            </Grid> 
        </Grid>
       
    )
} 