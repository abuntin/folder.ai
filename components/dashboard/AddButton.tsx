'use client' 


import { Box, IconButton, IconButtonProps } from '@mui/material'
import { AddSharp } from '@mui/icons-material'
import * as React from 'react' 
import { useDashboard } from './Context'
import { UploadPane } from './UploadPane'


export const AddButton: React.FC<IconButtonProps> = (props) => {

    const { useUpload } = useDashboard()

    const { uploadPane, toggleUploadPane } = useUpload()

    return (
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
            <IconButton {...props}>
                <AddSharp sx={{ fontSize: 20 }} color='disabled' />
            </IconButton>
            <UploadPane open={uploadPane} toggle={toggleUploadPane} />
        </Box>
        
    )
}