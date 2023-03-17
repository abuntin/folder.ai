'use client' 


import { Box, FormGroup } from '@mui/material'
import { margin, padding } from 'lib/magic'
import { DGrid, DBox, DText } from 'components'
import { FormOptionType } from 'lib/types'
import * as React from 'react' 
import { headings, options } from './text'
import { NewDealContext } from '.'



interface SelectDealPageProps {
} 

const key = 'selectDealPage'

const { selectDealPage: { heading, subheading } } = headings;

export const SelectDealPage: React.FC<SelectDealPageProps> = (props) => {

    const { save } = React.useContext(NewDealContext)
    
    const handleChange = (e: any, option: FormOptionType) => {
        save(key, option.value)
    }

    return (
        <>
            <DText text={heading} variant='h5' sx={{ marginBottom: margin * 2 }}/>
            <DText text={subheading} variant='body1' />
            <FormGroup>
                <DBox sx={{ padding }}>
                    <DGrid options={options} onChange={handleChange} />
                </DBox>
            </FormGroup> 
        </>
    )
}

