'use client';

import { Autocomplete, Box, InputAdornment, TextField, UseAutocompleteProps } from '@mui/material';
import * as React from 'react';
import { DText, DInput } from 'components';
import { margin, padding } from 'lib/constants';
import { FolderSharp } from '@mui/icons-material';

interface DAutocompleteProps<T>
  extends UseAutocompleteProps<T, false, false, false> {
    leading?: React.ReactNode
  }

export const DAutocomplete = <T extends { label?: string; name?: string, leading?: React.ReactNode }>(
  props: DAutocompleteProps<T>
) => {
  return (
    <Autocomplete<T>
      sx={{ minWidth: 60 }}
      autoHighlight
      autoSelect
      getOptionLabel={(option: T) => option.label ?? option.name}
      renderOption={(props, option: T) => (
        <Box
          component="li"
          sx={{
            padding: padding * 2,
            flexShrink: 0,
            backgroundColor: 'primary',
          }}
          {...props}
        >
          <DText text={option.label ?? option.name} />
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          sx={{ fontFamily: 'sans-serif', fontWeight: 'light' }}
          variant="standard"
          color="primary"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                {props.leading ?? <FolderSharp color='info' fontSize="small" />}
              </InputAdornment>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};
