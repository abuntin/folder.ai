'use client';

import * as React from 'react';
import { Box, useTheme } from '@mui/material';
import { padding, margin, borderRadius } from 'lib/constants';
import { TreeRoot } from 'components/common';

interface TreeViewProps {}

export const TreeView: React.FC<TreeViewProps> = props => {

  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        overflowX: 'hidden',
        overflowY: 'auto',
        borderRadius: borderRadius * 2,
        minHeight: 400,
        padding: padding * 2
      }}
    >
      <TreeRoot />
    </Box>
  );
};
