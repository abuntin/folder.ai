'use client';

import * as React from 'react';
import { m } from 'framer-motion';
import { Box, useTheme, Unstable_Grid2 as Grid } from '@mui/material';
import { padding, borderRadius } from 'lib/constants';
import { TreeView } from './TreeView';
import { ChatBox } from './ChatBox';

interface ContainerProps {}

export const Container: React.FC<ContainerProps> = props => {
  const theme = useTheme();

  return (
    <Box onContextMenu={e => e.preventDefault()} sx={{ height: '100%' }}>
      <Grid
        container
        columnSpacing={1}
        display="flex"
        justifyContent="space-between"
        sx={{
          paddingTop: padding * 2,
          paddingBottom: padding * 2,
          paddingLeft: padding * 2,
          paddingRight: padding * 2,
        }}
      >
        <Grid xs={3}>
          {/* <TreeView /> */}
        </Grid>
        <Grid xs={8} sx={{ height: '100%' }}>
          <ChatBox />
        </Grid>
        <Grid xs>
          <m.div
            layout
            style={{ backgroundColor: theme.palette.info.main }}
          ></m.div>
        </Grid>
      </Grid>
    </Box>
  );
};
