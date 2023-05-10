'use client';

import * as React from 'react';
import { Box, useTheme, Collapse } from '@mui/material';
import { padding, borderRadius, margin } from 'lib/constants';
import { TreeView } from './TreeView';
import { ChatBox } from './ChatBox';
import { ConsoleView } from './console';
import { ExpandMoreButton, DText } from 'components/common';
import { QueryProvider } from './context';

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
    <QueryProvider>
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
        justifyContent="center"
      >
        <Box display="flex" flexGrow={1} flexShrink={1}>
          <Box
            sx={{
              '&:hover': {
                backgroundColor: 'background.paper',
                cursor: 'pointer',
              },
              backgroundColor: view.tree ? 'action.active' : 'transparent',
              marginTop: margin,
              marginBottom: margin,
              borderTopLeftRadius: borderRadius * 4,
              borderBottomLeftRadius: borderRadius * 4,
            }}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            onClick={e => setView({ ...view, tree: view.tree ? false : true })}
          >
            <ExpandMoreButton
              expanded={view.tree}
              onClick={e =>
                setView({ ...view, tree: view.tree ? false : true })
              }
              color="primary"
              sx={{ '&:hover': { backgroundColor: 'transparent' } }}
            />
          </Box>

          <Collapse
            in={view.tree}
            easing="easeInOut"
            orientation="horizontal"
            component="div"
            sx={{
              display: 'flex',
              flex: 1,
              backgroundColor: 'action.active',
              marginTop: margin,
              marginBottom: margin,
              marginRight: margin,
              borderTopRightRadius: borderRadius * 2,
              borderBottomRightRadius: borderRadius * 2,
            }}
          >
            {/* <TreeView /> */}
          </Collapse>
        </Box>
        <Box flexGrow={1} flexShrink={1} flexBasis="100%" sx={{ margin }}>
          <ChatBox />
        </Box>
        <Box display="flex" flexGrow={1} flexShrink={1} width='70%'>
          <Collapse
            in={view.console}
            unmountOnExit
            easing="easeInOut"
            orientation="horizontal"
            component="div"
            sx={{
              display: 'flex',
              flex: 1,
              backgroundColor: 'info.dark',
              marginTop: margin,
              marginBottom: margin,
              marginLeft: margin,
              borderTopLeftRadius: borderRadius * 4,
              borderBottomLeftRadius: borderRadius * 4,
              width: '100%'
            }}
          >
            <ConsoleView />
          </Collapse>
          <Box
            sx={{
              '&:hover': {
                backgroundColor: 'background.paper',
                cursor: 'pointer',
              },
              backgroundColor: view.console ? 'info.dark' : 'transparent',
              marginTop: margin,
              marginBottom: margin,
              borderTopRightRadius: borderRadius * 2,
              borderBottomRightRadius: borderRadius * 2,
            }}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            onClick={e =>
              setView({ ...view, console: view.console ? false : true })
            }
          >
            <ExpandMoreButton
              expanded={!view.console}
              onClick={e =>
                setView({ ...view, console: view.console ? false : true })
              }
              color="primary"
              sx={{ '&:hover': { backgroundColor: 'transparent' } }}
            />
          </Box>
        </Box>
      </Box>
    </QueryProvider>
  );
};
