'use client';

import {
  Unstable_Grid2 as Grid,
  Paper,
  Stack,
  Popover,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import { padding } from 'lib/constants';
import { DText } from 'components';
import * as React from 'react';
import { useAppDispatch } from 'lib/redux';
import {
  CloseSharp,
  FileUploadSharp,
  CloudUploadSharp,
} from '@mui/icons-material';

interface UploadPaneProps {
  open: boolean;
  toggle?: (e: React.SyntheticEvent, state?: boolean) => void
}

export const UploadPane: React.FC<UploadPaneProps> = props => {

  const { open, toggle } = props;


  return (
    <Popover
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{ padding, backgroundColor: 'background.paper' }}
      >
        <Grid xs display="flex" justifyContent="end">
          <IconButton onClick={e => toggle(e, false)}>
            <CloseSharp />
          </IconButton>
        </Grid>
        <Grid xs={12}>
          <DText text="LIST FOLDERS HERE" variant="h6" />
        </Grid>
        <Grid xs={12} container>
          <Grid xs={12}>
            <DText text="From Computer" variant="body2" />
          </Grid>
          <Grid xs={12}>
            <Button
              fullWidth
              endIcon={<FileUploadSharp sx={{ fontSize: 60 }} />}
            >
              <Paper
                sx={{
                  padding,
                  backgroundColor: 'transparent',
                  '&:hover': { backgroundColor: 'background.paper' },
                }}
              >
                <form action="" onSubmit={e => e.preventDefault()}>
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    name="file"
                    multiple
                  />
                  <Stack spacing={3} direction="row">
                    <DText variant="h6" text="Local" />
                    <DText
                      variant="body1"
                      text="Import files from your local drive"
                    />
                  </Stack>
                </form>
              </Paper>
            </Button>
          </Grid>
        </Grid>
        <Divider color="disabled" />
        <Grid xs={6} container>
          <Grid xs={12}>
            <Button
              fullWidth
              endIcon={<CloudUploadSharp sx={{ fontSize: 60 }} />}
            >
              <Paper
                sx={{
                  padding,
                  backgroundColor: 'transparent',
                  '&:hover': { backgroundColor: 'background.paper' },
                }}
              >
                <Stack spacing={3} direction="column">
                  <DText variant="h6" text="Google Docs" />
                  <DText text="Connect to your Google account and import your files" />
                </Stack>
              </Paper>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Popover>
  );
};
