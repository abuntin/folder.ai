'use client';

import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useDashboard } from '.';
import { borderRadius, padding } from 'lib/constants';
import { AppearAnimationParent } from 'components/animation';

interface ContainerProps {}

export const Container: React.FC<ContainerProps> = props => {
  const { loading, kernel } = useDashboard();

  const { folders } = kernel;

  const HeaderComponent = React.useMemo(
    () => dynamic(() => import('./Header').then(_ => _.Header)),
    []
  );

  const BodyComponent = React.useMemo(() => {
    console.log('Component changed, loading...');
    if (folders && !loading.state)
      return dynamic(() => import('./Content').then(_ => _.Content));
    else
      return dynamic(() => import('./Loading').then(_ => _.LoadingComponent));
  }, [loading, folders]);

  return (
    <Box sx={{ paddingLeft: padding * 2, paddingRight: padding * 2 }}>
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
        >
          <HeaderComponent />
          <BodyComponent />
        </Grid>
      </AppearAnimationParent>
    </Box>
  );
};
