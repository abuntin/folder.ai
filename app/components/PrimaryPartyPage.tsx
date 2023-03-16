'use client'


import { Box, FormControlLabel, FormGroup, Input } from '@mui/material'
import { margin } from 'lib/magic'
import { labels, descriptions, heading, subheading } from './text';
import { DText, CountrySelect } from 'components'
import * as React from 'react' 


interface PrimaryPartyPageProps {
    state?: { name: string, country: string }
} 

export const PrimaryPartyPage: React.FC<PrimaryPartyPageProps> = ({ state }) => {

    const defaultFields = {
        name: state?.name ?? '',
        country: state?.country ?? ''
    } 

    const keys = Object.keys(defaultFields)

    const [fields, setFields] = React.useState(defaultFields);

    const handleChange = (e: any, field: string) => {      

        setFields({ ...fields, [field]: e.target.value })
    }

    return (
        <>
            <DText text={heading} variant='h5' sx={{ marginBottom: margin * 2 }}/>
            <DText text={subheading} variant='body1' />
            
            <FormGroup>
                <FormControlLabel
                    control={<Input sx={{ margin, width: 500, fontFamily: 'sans-serif', fontWeight: 'light' }} placeholder={labels[keys[0]]} value={fields[keys[0]]} onChange={e => handleChange(e, keys[0])} fullWidth />}
                    label={<DText text={descriptions[keys[0]]} variant='body2' />}
                    labelPlacement='top'
                    slotProps={{
                        typography: { align: 'left' }
                    }}
                />
                <FormControlLabel
                    control={
                        <CountrySelect onChange={e => handleChange(e, keys[1])} />
                        // <Select 
                        //     sx={{ margin, width: 500 }} 
                        //     label={<DText text={labels[keys[1]]} variant='body2' />} 
                        //     value={fields[keys[1]]} 
                            
                        //     variant='standard'
                        // >
                        //     {Object.entries(countries).map(([code, label]) => (
                        //         <MenuItem key={code} value={code} sx={{ width: 200 }}>
                        //             <DText text={label} variant='body2' sx={{ alignContent: 'center', width: 200 }} />
                        //         </MenuItem>
                        //     ))}
                        // </Select>
                    }
                    label={<DText text={descriptions[keys[1]]} variant='body2' />}
                    labelPlacement='top'
                />
            </FormGroup>
            
        </>
       
    )
} 