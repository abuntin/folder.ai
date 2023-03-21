import * as React from 'react'
import { Autocomplete, TextField, Box, UseAutocompleteProps, InputAdornment } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public';
import { margin } from 'lib/magic'
import { DText } from './DText'
import { CountryType } from 'lib/types'

interface CountrySelectProps<T> extends UseAutocompleteProps<T, false, false, false> {}

export const CountrySelect: React.FC<CountrySelectProps<CountryType>> = (props) => {

  const { value } = props;
  const [leading, setLeading] = React.useState<React.ReactNode>(
    (value && value.code) ?
      <img
        loading="eager"
        width="20"
        src={`https://flagcdn.com/w20/${value.code.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w40/${value.code.toLowerCase()}.png 2x`}
        alt=""
      />
    : null
  );

  const handleChange = (e: any, value: CountryType, reason: "createOption" | "selectOption" | "removeOption" | "blur" | "clear") => {
      setLeading(
        (reason == 'removeOption' || reason == 'clear') ? null :
        <img
          loading="eager"
          width="20"
          src={`https://flagcdn.com/w20/${value.code.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w40/${value.code.toLowerCase()}.png 2x`}
          alt=""
        />
      )
    if (props.onChange != null) props.onChange(e, value, reason)
  }

  return (
    <Autocomplete
      sx={{ width: 300 }}
      options={props.options}
      autoHighlight
      autoSelect
      getOptionLabel={(option: CountryType) => option.label}
      onChange={handleChange}
      renderOption={(props, option: CountryType) => (
        <Box component="li" sx={{ '& > img': { mr: margin, flexShrink: 0, backgroundColor: 'primary' } }} {...props}>
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          <DText text={`${option.label} (${option.code})`} />
        </Box>
      )}
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
                {leading ?? <PublicIcon fontSize='small' />}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
