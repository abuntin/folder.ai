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
import { AnimatePresence, m } from 'framer-motion';
import { margin } from 'lib/constants';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useDashboard } from '../context';

interface ActionsProps {}

export const Actions: React.FC<ActionsProps> = props => {
  const { kernel, selected, useDashboardApi } = useDashboard();

  const [isPending, startTransition] = React.useTransition();

  const [expanded, setExpandedState] = React.useState(false);

  const [recentAction, setRecentActionState] = React.useState<
    'copy' | 'rename' | 'move' | 'delete' | null
  >(null);

  const setExpanded = (e: React.SyntheticEvent) =>
    startTransition(() => setExpandedState(expanded ? false : true));

  const setRecentAction = (action: typeof recentAction) =>
    startTransition(() => setRecentActionState(action));

  const { folderActions } = useDashboardApi();

  const { handleCut, handleCopy, handleRename } = folderActions;

  const RecentActionDialog = React.useMemo(() => {
    if (selected && recentAction) {
      const Dialog =
        recentAction === 'delete'
          ? dynamic(() => import('./DeleteDialog').then(_ => _.DeleteDialog))
          : recentAction === 'copy' || recentAction == 'move'
          ? dynamic(() =>
              import('./LocationChangeDialog').then(_ => _.LocationChangeDialog)
            )
          : recentAction === 'rename'
          ? dynamic(() => import('./RenameDialog').then(_ => _.RenameDialog))
          : null;

      const defaultProps = {
        open: selected != null,
        onClose: e => setRecentAction(null),
      };

      return Dialog ? (
        <Dialog
          {...defaultProps}
          type={
            recentAction == 'move'
              ? 'move'
              : recentAction == 'copy'
              ? 'copy'
              : undefined
          }
        />
      ) : (
        <> </>
      );
    } else return <></>;
  }, [recentAction]);

  return React.useMemo(
    () => (
      <Grid container display="flex" alignItems="center">
        <Grid xs display="flex" flexDirection="row" alignItems="center">
          <Tippy content="Folder Actions">
            <ExpandMoreButton
              expand={expanded}
              color="primary"
              onClick={setExpanded}
            />
          </Tippy>
        </Grid>
        <Grid xs={10} display="flex" flexDirection="row" alignItems="center">
          {expanded && (
            <AnimatePresence>
              <m.div
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: '0%' }}
                exit={{ opacity: 0, x: '-100%' }}
                transition={{
                  duration: 0.1,
                  ease: [0, 0.71, 0.2, 1.01],
                  x: {
                    duration: 0.5,
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
                    disabled={true}
                    onClick={e => {
                      setRecentAction('rename');
                      handleRename(e);
                    }}
                    sx={{
                      backgroundColor:
                        recentAction == 'rename'
                          ? 'background.paper'
                          : 'inherit',
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
                    onClick={e => {
                      setRecentAction('copy');
                      handleCopy(e);
                    }}
                  >
                    <FolderCopySharp />
                  </TippedIconButton>
                  <TippedIconButton
                    tooltip="Move"
                    color="primary"
                    disabled={selected == null}
                    onClick={e => {
                      setRecentAction('move');
                      handleCut(e);
                    }}
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
                        recentAction == 'delete'
                          ? 'background.paper'
                          : 'inherit',
                    }}
                  >
                    <DeleteForeverSharp />
                  </TippedIconButton>
                </Stack>
              </m.div>
            </AnimatePresence>
          )}
        </Grid>
        {selected && recentAction && RecentActionDialog}
      </Grid>
    ),
    [expanded, recentAction]
  );
};
