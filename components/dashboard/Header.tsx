'use client';

import { GridViewSharp, ViewListSharp } from '@mui/icons-material';
import {
  Unstable_Grid2 as Grid,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { DInput, AddButton } from 'components/common';
import * as React from 'react';
import { useDashboard } from './Context';
import dynamic from 'next/dynamic'

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = props => {
  const { kernel, view, useUpload, loading, appbar } = useDashboard();

  const { toggleUploadPane, uploadPane } = useUpload();

  const KernelBar = dynamic(() => import('./AppBar').then(_ => _.AppBar))

  const AIButton = dynamic(() => import('./AppBarButton').then(_ => _.AppBarButton))

  // const KernelBar = React.useMemo(() => {
  //   return (
  //     (!loading.state && appbar !=  null) ? (appbar == 'min' ? dynamic(() => import('./AppBarButton').then(_ => _.AppBarButton))
  //     : dynamic(() => import('./AppBar').then(_ => _.AppBar)))
  //     : React.Fragment
  //   )
  // }, [appbar, loading])
  return (
    <Grid
      xs={12}
      container
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid xs={10} display="flex" alignItems="stretch">
          <KernelBar />
          <AIButton />
      </Grid>
      <Grid
        container
        xs={2}
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Grid xs={6} display="flex" justifyContent="center">
          <AddButton disabled={loading.state} />
        </Grid>
        <Grid xs={6} display="flex" justifyContent="start">
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newVal) => kernel.trigger('view', newVal)}
            disabled={loading.state}
          >
            <ToggleButton value="grid" size="small">
              <GridViewSharp color={view === 'grid' ? 'info' : 'disabled'} />
            </ToggleButton>
            <ToggleButton value="tile" size="small">
              <ViewListSharp color={view === 'grid' ? 'disabled' : 'info'} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
};
