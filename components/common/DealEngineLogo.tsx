'use client' 


import * as React from 'react' 
import { Settings } from '@mui/icons-material'
import { RotateAnimation } from 'components/animation'
import { Stack } from '@mui/material'

interface DealEngineLogoProps {
    
} 


export const DealEngineLogo: React.FC<DealEngineLogoProps> = (props) => {

    return (
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <RotateAnimation>
                <Settings fontSize='large' color='secondary'/>
            </RotateAnimation>
        </Stack>
    )
}

