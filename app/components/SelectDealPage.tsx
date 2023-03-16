'use client' 


import { Box, FormGroup } from '@mui/material'
import { margin, padding } from 'lib/magic'
import { DGrid, DBox, DText } from 'components'
import { FormOptionType } from 'lib/types'
import * as React from 'react' 
import { heading, options, subheading } from './text'



interface SelectDealPageProps {
    
} 

export const SelectDealPage: React.FC<SelectDealPageProps> = (props) => {

    const [selected, setSelected] = React.useState<FormOptionType>(options[0]);

    const [fields, setFields] = React.useState({
        selectDeal: {
            selected: ''
        },
        primaryParty: {
            name: '',
            country: ''
        }
    })
    
    const handleChange = (e: any, option: FormOptionType) => {
        setSelected(option)
    }


    const renderOptions = () => (

        <DGrid options={options} onChange={handleChange} />
    )

    return (
        <Box>
            <DText text={heading} variant='h5' sx={{ marginBottom: margin * 2 }}/>
            <DText text={subheading} variant='body1' />
            <FormGroup>
                <DBox sx={{ padding }}>
                    {renderOptions()}
                </DBox>
            </FormGroup> 
        </Box>
    )
}

