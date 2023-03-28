import * as React from 'react'
import { Autocomplete, TextField, Box, UseAutocompleteProps, InputAdornment } from '@mui/material'
import { margin } from 'lib/constants'
import { DText } from './DText'

const currencies = require('lib/constants/currencies.json')

interface CurrencySelectProps<T> extends Omit<UseAutocompleteProps<T, false, false, false>, 'options'> {
}

export const CurrencySelect: React.FC<CurrencySelectProps<string>> = (props) => {

  const [leading, setLeading] = React.useState('');

  const handleChange = (e: any, value: string, reason: "createOption" | "selectOption" | "removeOption" | "blur" | "clear") => {
    if (props.onChange != null) props.onChange(e, value, reason)
    setLeading(value)
  }

  return (
    <Autocomplete
      sx={{ width: 'max-width' }}
      options={Object.keys(currencies)}
      autoHighlight
      autoSelect
      onChange={handleChange}
      renderOption={(props, option: string) => {
        return (
          <Box {...props} component="li" sx={{ mr: margin, flexShrink: 0, backgroundColor: 'primary' }}>
            <DText text={currencies[option].name} />
          </Box>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ fontFamily: 'sans-serif', fontWeight: 'light' }}
          variant='standard'
          color='primary'
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <DText text={leading} />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
