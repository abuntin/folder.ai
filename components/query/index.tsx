'use client';

import * as React from 'react';
import { m } from 'framer-motion';
import { Box, Stack, Unstable_Grid2 as Grid } from '@mui/material';
import { padding, borderRadius } from 'lib/constants';
import { DInput, TreeRoot } from 'components/common';

interface ContainerProps {}

export const Container: React.FC<ContainerProps> = props => {
  return (
    <Box sx={{ height: '90%' }} onContextMenu={e => e.preventDefault()}>
      <Grid
        container
        display="flex"
        justifyContent="space-between"
        sx={{
          paddingTop: padding * 5,
          paddingBottom: padding * 5,
          borderRadius,
          backgroundColor: 'background.default',
        }}
      >
        <Grid xs={2}>
          <m.div
            layout
            style={{
              backgroundColor: 'info',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            <TreeRoot />
          </m.div>
        </Grid>
        <Grid xs={6} sx={{ height: '100%' }}>
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
              <Grid xs={2}>
                <DInput
                  fullWidth
                  placeholder="Something like, 'Hey FolderAI'"
                />
              </Grid>
            </Grid>
          </m.div>
        </Grid>
        <Grid xs={4}>
          <m.div layout style={{ backgroundColor: 'info' }}></m.div>
        </Grid>
      </Grid>
    </Box>
  );
};
