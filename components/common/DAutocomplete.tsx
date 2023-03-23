'use client' 


import { Autocomplete, Box, UseAutocompleteProps } from '@mui/material'
import * as React from 'react' 
import { DText, DInput } from 'components'
import { margin, padding } from 'lib/constants'


interface DAutocompleteProps<T> extends UseAutocompleteProps<T, false, false, false> {}
    

export const DAutocomplete = <T extends { label: string }>(props: DAutocompleteProps<T>) => {

    return (
        <Autocomplete<T>
            //sx={{ width: 300 }}
            autoHighlight
            autoSelect
            getOptionLabel={(option: T) => option.label}
            renderOption={(props, option: T) => (
                <Box component="li" sx={{ padding: padding * 2, flexShrink: 0, backgroundColor: 'primary' }} {...props}>
                    <DText text={option.label} />
                </Box>
            )}
            renderInput={(params) => <DInput {...params} fullWidth />}
            {...props}
        />
    )
}