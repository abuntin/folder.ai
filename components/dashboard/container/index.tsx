'use client';

import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useDashboard } from '..';
import { borderRadius, padding } from 'lib/constants';
import { AppearAnimationParent } from 'components/animation';

interface ContainerProps {}

export const Container: React.FC<ContainerProps> = props => {
  const { loading, kernel } = useDashboard();

  const { folders, current } = kernel;

  const BodyComponent = React.useMemo(() => {
    console.log('Component changed, loading...');
    if (folders && current && !loading)
      return dynamic(() => import('./Content').then(_ => _.Content));
    else
      return dynamic(() => import('../Loading').then(_ => _.LoadingComponent));
  }, [loading, folders]);

  const HeaderComponent = React.useMemo(() => {
    console.log('Component changed, loading...');
    if (folders && current && !loading)
      return dynamic(() => import('../header').then(_ => _.Header));
    else return React.Fragment;
  }, [loading, folders]);

  return (
    <Box
      sx={{ paddingLeft: padding * 2, paddingRight: padding * 2 }}
      onContextMenu={e => e.preventDefault()}
    >
      <AppearAnimationParent>
        <Grid
          container
          spacing={4}
          display="flex"
          justifyContent="space-between"
          sx={{
            pl: padding * 2,
            pr: padding * 2,
            borderRadius,
            bgColor: theme => theme.palette.common.white,
          }}
          //onClick={e => kernel.trigger('select', null)}
        >
          <HeaderComponent />
          <BodyComponent />
        </Grid>
      </AppearAnimationParent>
    </Box>
  );
};
