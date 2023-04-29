'use client';

import * as React from 'react';
import { m } from 'framer-motion';
import { Box, useTheme, Unstable_Grid2 as Grid } from '@mui/material';
import { padding, borderRadius } from 'lib/constants';
import { DInput, TreeRoot } from 'components/common';
import { TreeView } from './TreeView';

interface ContainerProps {}

export const Container: React.FC<ContainerProps> = props => {

  const theme = useTheme()

  return (
    <Box sx={{ height: '90%' }} onContextMenu={e => e.preventDefault()}>
      <Grid
        container
        columnSpacing={1}
        display="flex"
        justifyContent="space-between"
        sx={{
          paddingTop: padding * 5,
          paddingBottom: padding * 5,
          paddingLeft: padding * 2,
          paddingRight: padding * 2,
          borderRadius,
          backgroundColor: 'background.default',
        }}
      >
        <Grid xs={3}>
          <m.div
            layout
          >
          <TreeView />
          </m.div>
        </Grid>
        <Grid xs={5} sx={{ height: '100%' }}>
          <m.div layout>
            <Grid container spacing={2} direction="column">
              <Grid xs={10}>
                <Box
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius,
                    padding,
                    minHeight: 400,
                  }}
                >
                  CHATBOX
                </Box>
              </Grid>
              <Grid xs>
                <DInput
                  fullWidth
                  placeholder="Something like, 'Hey FolderAI'"
                />
              </Grid>
            </Grid>
          </m.div>
        </Grid>
        <Grid xs={4}>
          <m.div layout style={{ backgroundColor: theme.palette.info.main }}></m.div>
        </Grid>
      </Grid>
    </Box>
  );
};
