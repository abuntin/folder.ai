'use client';

import * as React from 'react';
import { m } from 'framer-motion';
import { Box, useTheme, Unstable_Grid2 as Grid, Collapse } from '@mui/material';
import { padding, borderRadius, margin } from 'lib/constants';
import { TreeView } from './TreeView';
import { ChatBox } from './ChatBox';
import { ExpandMoreButton } from 'components/common';

interface ContainerProps {}

export const Container: React.FC<ContainerProps> = props => {
  const theme = useTheme();

  const [view, setView] = React.useState<{
    [pane in 'tree' | 'chat' | 'console']: boolean;
  }>({
    tree: true,
    chat: true,
    console: true,
  });

  return (
    <Box
      onContextMenu={e => e.preventDefault()}
      sx={{
        position: 'absolute',
        top: 150,
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: padding * 2,
        paddingBottom: padding * 2,
        paddingLeft: padding * 2,
        paddingRight: padding * 2,
      }}
      display="flex"
      flexDirection="row"
      alignItems="stretch"
    >
      <Box display="flex" flexGrow={1} flexShrink={1}>
        <ExpandMoreButton
        aria-label='Tree'
          color="primary"
          expanded={view.tree}
          onClick={e => setView({ ...view, tree: view.tree ? false : true })}
        />
        <Collapse
          in={view.tree}
          easing="easeInOut"
          orientation="horizontal"
          component="div"
          sx={{
            display: 'flex',
            flex: 1,
            backgroundColor: 'info.main',
            margin,
          }}
        >
          {/* <TreeView /> */}
          TreeView Here
        </Collapse>
      </Box>
      <Box flexGrow={1} flexShrink={1} flexBasis="100%" sx={{ margin }}>
        <ChatBox />
      </Box>
      <Box display="flex" flexGrow={1} flexShrink={1}>
        <Collapse
          in={view.console}
          easing="easeInOut"
          orientation="horizontal"
          component="div"
          sx={{
            display: 'flex',
            flex: 1,
            backgroundColor: 'info.main',
            margin,
          }}
        >
          Console Here
        </Collapse>
        <ExpandMoreButton
          aria-label='Console'
          color="primary"
          expanded={!view.console}
          onClick={e =>
            setView({ ...view, console: view.console ? false : true })
          }
        />
      </Box>
    </Box>
  );
};
