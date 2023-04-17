'use client';

import { Box, Divider, Unstable_Grid2 as Grid } from '@mui/material';
import { borderRadius, padding } from 'lib/constants';
import dynamic from 'next/dynamic';
import * as React from 'react';

interface AppBarProps {}

export const AppBar: React.FC<AppBarProps> = props => {
  const Actions = React.memo(
    dynamic(() => import('./Actions').then(_ => _.Actions))
  );

  const ActionInfo = React.memo(
    dynamic(() => import('./Info').then(_ => _.ActionInfo))
  );

  const NavInfo = React.memo(
    dynamic(() => import('./Nav').then(_ => _.NavInfo))
  );

  return (
    <Grid
      container
      spacing={1}
      display="flex"
      justifyContent="space-between"
      sx={{
        padding,
        borderRadius,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'background.paper',
        },
        minWidth: '100%',
        maxWidth: '115%',
      }}
    >
      <Grid xs={2} display="flex" justifyContent="start">
        <NavInfo />
      </Grid>
      <Divider flexItem orientation="vertical" />
      <Grid xs={3} display="flex" flexDirection="row" alignItems="center">
        <Actions />
      </Grid>
      <Divider flexItem orientation="vertical" />
      <Grid xs={4} display="flex" justifyContent="start" alignItems="center">
        <ActionInfo />
      </Grid>
    </Grid>
  );
};
