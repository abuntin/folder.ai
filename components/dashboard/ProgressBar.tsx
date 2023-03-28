'use client' 


import { Box, BoxProps } from '@mui/system'
import { DBox } from 'components'
import { padding, borderRadius } from 'lib/constants'
import * as React from 'react' 


interface ProgressBarProps extends BoxProps {
    progress: string
} 

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {

    const { progress } = props;

    return (
       <Box sx={{ borderRadius }}> 
            <Box sx={{ width: progress, height: padding * 5, backgroundColor: 'green' }} /> 
       </Box>
    )
}
