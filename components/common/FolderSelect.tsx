import { FolderSharp, SnippetFolderSharp } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  UseAutocompleteProps,
} from '@mui/material';
import { useKernel } from 'components/app';
import { Folder, TreeNode } from 'lib/models';
import * as React from 'react';
import { DText } from './DText';

interface FolderSelectProps<T>
  extends Omit<UseAutocompleteProps<T, false, false, false>, 'options'> {
  variant?: 'small' | 'medium' | 'large';
}

export const FolderSelect: React.FC<FolderSelectProps<TreeNode>> = props => {
  const { value, variant = 'small', ...rest } = props;

  const { kernel } = useKernel();

  const { currentDirectoriesExcl: directoriesExcl } = kernel;

  return (
    <Autocomplete
      sx={{ minWidth: 200 }}
      autoHighlight
      autoSelect
      options={directoriesExcl}
      getOptionLabel={(option: TreeNode) => option.folder.name}
      renderOption={(props, option: TreeNode) => {
        return (
          <Box
            {...props}
            component="li"
            sx={{ backgroundColor: 'action.active' }}
          >
            <FolderSharp
              color="info"
              sx={{
                fontSize:
                  variant == 'small' ? 10 : variant == 'medium' ? 12 : 14,
              }}
            />
            <DText text={option.folder.name} />
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
            startAdornment: value ? (
              <InputAdornment position="start">
                {value.folder.isDirectory ? (
                  <FolderSharp
                    color="info"
                    sx={{
                      fontSize:
                        variant == 'small' ? 10 : variant == 'medium' ? 12 : 14,
                    }}
                  />
                ) : (
                  <SnippetFolderSharp
                    color="primary"
                    sx={{
                      fontSize:
                        variant == 'small' ? 10 : variant == 'medium' ? 12 : 14,
                    }}
                  />
                )}
              </InputAdornment>
            ) : (
              <> </>
            ),
          }}
        />
      )}
      {...rest}
    />
  );
};
