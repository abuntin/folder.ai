import * as React from 'react'
import { Autocomplete, TextField, Box, UseAutocompleteProps, InputAdornment } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public';
import { margin } from 'lib/constants'
import { DText } from './DText'
import { CountryType, countries } from 'lib/constants'

interface CountrySelectProps<T> extends Omit<UseAutocompleteProps<T, false, false, false>, 'options'> {
}

export const CountrySelect: React.FC<CountrySelectProps<CountryType>> = (props) => {

  const { value } = props;

  const [leading, setLeading] = React.useState<React.ReactNode>(
    value ?
      <img
        loading="eager"
        width="20"
        src={`https://flagcdn.com/w20/${value.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w40/${value.toLowerCase()}.png 2x`}
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
          src={`https://flagcdn.com/w20/${value.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w40/${value.toLowerCase()}.png 2x`}
          alt=""
        />
      )
    if (props.onChange != null) props.onChange(e, value, reason)
  }


  return (
    <Autocomplete
      sx={{ width: 300 }}
      options={Object.keys(countries)}
      autoHighlight
      autoSelect
      getOptionLabel={(option: CountryType) => countries[option]}
      onChange={handleChange}
      renderOption={(props, option: CountryType) => {
        return (
          <Box {...props} component="li" sx={{ '& > img': { mr: margin, flexShrink: 0, backgroundColor: 'primary' }}}>
            <img
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.toLowerCase()}.png 2x`}
              alt=""
            />
            <DText text={`${countries[option]} (${option})`} />
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
                {leading ?? <PublicIcon fontSize='small' />}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
