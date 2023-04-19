import { FolderSharp } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  UseAutocompleteProps,
} from '@mui/material';
import { Folder } from 'lib/models';
import * as React from 'react';
import { DText } from './DText';

interface FolderSelectProps<T>
  extends UseAutocompleteProps<T, false, false, false> {
  variant?: 'small' | 'medium' | 'large';
}

export const FolderSelect: React.FC<FolderSelectProps<Folder>> = props => {
  const { value, variant = 'small', ...rest } = props;

  return (
    <Autocomplete
      sx={{ minWidth: 200 }}
      autoHighlight
      autoSelect
      getOptionLabel={(option: Folder) => option.name}
      renderOption={(props, option: Folder) => {
        return (
          <Box {...props} component="li">
            <FolderSharp
              color='info'
              sx={{
                fontSize:
                  variant == 'small' ? 10 : variant == 'medium' ? 12 : 14,
              }}
            />
            <DText text={option.name} />
          </Box>
        );
      }}
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
              value ? (<InputAdornment position="start">
                <FolderSharp color='info' sx={{ fontSize: variant == 'small' ? 10 : variant == 'medium' ? 12 : 14}} />
              </InputAdornment>) : <> </>
            ),
          }}
        />
      )}
      {...rest}
    />
  );
};
