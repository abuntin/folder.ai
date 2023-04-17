import * as React from 'react';
import { Stack, Box } from '@mui/material';
import { FolderSharp } from '@mui/icons-material';
import { DText } from 'components/common';
import { useDashboard } from '../context';

export const NavInfo = () => {
  const { kernel } = useDashboard();

  const { folders, current } = kernel;

  return React.useMemo(
    () =>
      current && folders ? (
        <Stack>
          <DText
            text={`/${current.path}`}
            variant="subtitle1"
            fontWeight="medium"
          />
          <Box display="flex" flexDirection="row" alignItems="center">
            <DText text={folders.length} variant="body2" fontWeight="medium" />
            <FolderSharp color="primary" sx={{ fontSize: 14 }} />
          </Box>
        </Stack>
      ) : (
        <DText
          text="No current directory"
          variant="subtitle1"
          fontWeight="medium"
        />
      ),
    [current, folders]
  );
};
