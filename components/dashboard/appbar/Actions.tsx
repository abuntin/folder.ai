'use client';

import {
  DriveFileMoveSharp,
  EditSharp,
  FolderCopySharp,
  DeleteForeverSharp,
} from '@mui/icons-material';
import { Unstable_Grid2 as Grid, Stack } from '@mui/material';
import Tippy from '@tippyjs/react';
import { ExpandMoreButton, TippedIconButton } from 'components/common';
import { m } from 'framer-motion';
import { margin } from 'lib/constants';
import * as React from 'react';
import { useDashboard, useDashboardApi } from '../context';

interface ActionsProps {}

export const Actions: React.FC<ActionsProps> = props => {
  const { kernel, selected, useDashboardApi } = useDashboard();

  const { folderActions, state } = useDashboardApi();

  const { handleCut, handleCopy, handleRename } = folderActions;

  const { expanded, recentAction, setRecentAction, handleActionExpand } = state;

  return React.useMemo(
    () => (
      <Grid container display="flex" alignItems="center">
        <Grid xs display="flex" flexDirection="row" alignItems="center">
          <Tippy content="Folder Actions">
            <ExpandMoreButton
              expand={expanded}
              color="primary"
              onClick={handleActionExpand}
            />
          </Tippy>
        </Grid>
        <Grid xs={10} display="flex" flexDirection="row" alignItems="center">
          {expanded && (
            <m.div
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: '0%' }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{
                duration: 0.1,
                ease: [0, 0.71, 0.2, 1.01],
                x: {
                  type: 'spring',
                  damping: 20,
                  stiffness: 100,
                  restDelta: 0.001,
                },
              }}
              style={{ minWidth: '20%', marginLeft: margin * 8 }}
            >
              <Stack direction="row" spacing={1}>
                <TippedIconButton
                  tooltip="Rename"
                  color="primary"
                  disabled={selected == null}
                  onClick={handleRename}
                  sx={{
                    backgroundColor:
                      recentAction == 'rename' ? 'background.paper' : 'inherit',
                  }}
                >
                  <EditSharp />
                </TippedIconButton>
                <TippedIconButton
                  tooltip="Copy"
                  sx={{
                    backgroundColor:
                      recentAction == 'copy' ? 'background.paper' : 'inherit',
                  }}
                  color="primary"
                  disabled={selected == null}
                  onClick={handleCopy}
                >
                  <FolderCopySharp />
                </TippedIconButton>
                <TippedIconButton
                  tooltip="Move"
                  color="primary"
                  disabled={selected == null}
                  onClick={handleCut}
                  sx={{
                    backgroundColor:
                      recentAction == 'move' ? 'background.paper' : 'inherit',
                  }}
                >
                  <DriveFileMoveSharp />
                </TippedIconButton>

                <TippedIconButton
                  tooltip="Delete"
                  color="error"
                  disabled={selected == null}
                  onClick={e => {
                    setRecentAction('delete');
                    kernel.trigger('cut', []);
                  }}
                  sx={{
                    backgroundColor:
                      recentAction == 'delete' ? 'background.paper' : 'inherit',
                  }}
                >
                  <DeleteForeverSharp />
                </TippedIconButton>
              </Stack>
            </m.div>
          )}
        </Grid>
      </Grid>
    ),
    [expanded, recentAction]
  );
};
