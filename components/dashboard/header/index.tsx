'use client';

import { GridViewSharp, ViewListSharp } from '@mui/icons-material';
import {
  Unstable_Grid2 as Grid,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import * as React from 'react';
import { useDashboard } from '../context';
import dynamic from 'next/dynamic';
import { Actions } from './Actions'
import { AddButton } from '../addbutton';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = props => {
  const { kernel, view, loading } = useDashboard();

  //const KernelBar = React.memo(dynamic(() => import('./Actions').then(_ => _.Actions)))

  // const AddButton = dynamic(() =>
  //   import('../addbutton').then(_ => _.AddButton)
  // );

  React.useEffect(() => console.log('rerendered header'), [])

  return (
    <Grid
      xs={12}
      container
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid xs={10} display="flex" alignItems="stretch">
        <Actions />
      </Grid>
      <Grid
        container
        xs={2}
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Grid xs={6} display="flex" justifyContent="center">
          <AddButton />
        </Grid>
        <Grid xs={6} display="flex" justifyContent="start">
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newVal) => kernel.trigger('view', newVal)}
            disabled={loading}
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
