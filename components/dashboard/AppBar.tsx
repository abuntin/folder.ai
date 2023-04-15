'use client';

import {
  ArrowForwardSharp,
  CloseSharp,
  CloseFullscreenSharp,
  DeleteSharp,
  DoneSharp,
  DriveFileMoveSharp,
  FolderCopySharp,
  FolderDeleteSharp,
  FolderSharp,
  EditSharp,
} from '@mui/icons-material';
import Tippy from '@tippyjs/react';
import {
  Box,
  IconButton,
  Divider,
  Stack,
  Unstable_Grid2 as Grid,
  useTheme,
} from '@mui/material';
import { NavAnimation, PanDownAnimation } from 'components/animation';
import {
  DText,
  ExpandMoreButton,
  FolderSelect,
  TippedIconButton,
} from 'components/common';
import { m } from 'framer-motion';
import { borderRadius, margin, padding } from 'lib/constants';
import { Folder } from 'lib/models';
import * as React from 'react';
import { useDashboard } from './Context';

interface AppBarProps {}

export const AppBar: React.FC<AppBarProps> = props => {
  const theme = useTheme();
  const { selected, kernel, useDashboardApi } = useDashboard();

  const { current, folders } = kernel;

  const { clipboard } = useDashboardApi();

  const [expanded, setExpanded] = React.useState({
    folderActions: false,
  });

  const [destination, setDestination] = React.useState<Folder>(null);

  const [recentAction, setRecentAction] = React.useState<
    'rename' | 'move' | 'copy' | 'delete' | null
  >(null);

  const handleCut = (e: React.SyntheticEvent) => {
    setRecentAction('move');
    kernel.trigger('cut', [selected]);
  };

  const handlePaste = (e: React.SyntheticEvent) => {
    kernel.trigger('paste', {
      folders: clipboard,
      directory: destination,
    });
  };

  const handleMove = (e: React.SyntheticEvent) => {
    kernel.trigger('move', {
      folders: clipboard,
      directory: destination,
    });
  };

  const handleRename = (e: React.SyntheticEvent) => {
    if (!selected) {
      kernel.trigger('error', 'Select a Folder to rename');
      return;
    }

    kernel.trigger('rename', {
      name: '',
      folder: selected,
      directory: kernel.current,
    });
  };

  const handleDelete = (e: React.SyntheticEvent) => {
    if (!selected) {
      kernel.trigger('error', 'Select a Folder to delete');
      return;
    }

    kernel.trigger('delete', [selected]);
  };

  const handleClear = (e: React.SyntheticEvent) => {
    kernel.trigger('cut', []);
    setRecentAction(null);
  };

  const handleActionExpand = (e: React.SyntheticEvent) => {
    if (expanded.folderActions) setRecentAction(null);
    setExpanded({
      ...expanded,
      folderActions: expanded.folderActions ? false : true,
    });
  };

  const handleCopy = (e: React.SyntheticEvent) => {
    setRecentAction('copy');
    kernel.trigger('copy', [selected]);
  };

  const folderActions = React.useMemo(
    () => ({
      copy: { state: selected == null },
      move: { state: selected == null },
      delete: { state: selected == null },
      rename: { state: selected == null },
    }),
    [selected, current, folders, clipboard]
  );

  const currentDir = React.useMemo(
    () =>
      current && folders ? (
        <Stack>
          <DText
            text={`/${current.path}`}
            variant="subtitle1"
            fontWeight="medium"
          />
          <Box display="flex" flexDirection="row" alignItems="center">
            <DText text={folders.length} variant="body2" fontWeight="medium" />
            <FolderSharp color="primary" sx={{ fontSize: 14 }} />
          </Box>
        </Stack>
      ) : (
        <DText
          text="No current directory"
          variant="subtitle1"
          fontWeight="medium"
        />
      ),
    [current, folders]
  );

  return (
    <Box
      sx={{
        padding: 1,
        borderRadius,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'background.paper',
        },
        minWidth: '100%',
        maxWidth: '115%',
      }}
    >
      <Grid container spacing={1} display="flex" justifyContent="space-between">
        <Grid xs={2} display="flex" justifyContent="start">
          {currentDir}
        </Grid>
        <Divider flexItem orientation="vertical" />
        <Grid xs display="flex" flexDirection="row" alignItems="center">
          <Tippy content="Folder Actions">
            <ExpandMoreButton
              expand={expanded.folderActions}
              color="primary"
              onClick={handleActionExpand}
            />
          </Tippy>
        </Grid>
        <Grid xs={3} display="flex" flexDirection="row" alignItems="center">
          {expanded.folderActions && (
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
                  disabled={folderActions.rename.state}
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
                      recentAction == 'copy'
                        ? 'background.paper'
                        : 'background.default',
                  }}
                  color="primary"
                  disabled={folderActions.copy.state}
                  onClick={handleCopy}
                >
                  <FolderCopySharp />
                </TippedIconButton>
                <TippedIconButton
                  tooltip="Move"
                  color="primary"
                  disabled={folderActions.move.state}
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
                  disabled={folderActions.delete.state}
                  onClick={e => {
                    setRecentAction('delete');
                  }}
                >
                  <FolderDeleteSharp />
                </TippedIconButton>
              </Stack>
            </m.div>
          )}
        </Grid>
        <Divider flexItem orientation="vertical" sx={{ mr: margin * 5 }} />
        <Grid xs={5} display="flex" justifyContent="start" alignItems="center">
          <NavAnimation whileHover={{ background: 'background.paper' }}>
            {clipboard.length ? (
              recentAction && recentAction !== 'delete' ? (
                <NavAnimation
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <DText
                      color="primary"
                      fontWeight="regular"
                      text={`${
                        recentAction == 'copy'
                          ? 'Paste To: '
                          : recentAction == 'move'
                          ? 'Move To: '
                          : ''
                      }`}
                    />
                    <FolderSelect
                      options={folders.filter(folder => folder.isDirectory)}
                      onChange={(e, value, reason) => {
                        if (reason == 'selectOption') setDestination(value);
                        else if (reason == 'clear') setDestination(null);
                        else return;
                      }}
                    />

                    <IconButton
                      onClick={
                        recentAction == 'copy'
                          ? handlePaste
                          : recentAction == 'move'
                          ? handleMove
                          : undefined
                      }
                      color="inherit"
                      disabled={destination == null}
                    >
                      <ArrowForwardSharp />
                    </IconButton>
                    <IconButton onClick={handleClear} color="inherit">
                      <CloseSharp />
                    </IconButton>
                  </Stack>
                </NavAnimation>
              ) : (
                <PanDownAnimation>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <DText
                      text={`Clipboard: ${clipboard[0].name}`}
                      color="primary"
                    />
                    <TippedIconButton
                      onClick={handleClear}
                      color="warning"
                      tooltip="Clear"
                    >
                      <DeleteSharp />
                    </TippedIconButton>
                  </Stack>
                </PanDownAnimation>
              )
            ) : selected ? (
              recentAction == 'delete' ? (
                <NavAnimation>
                  <Stack>
                    <DText text={`Delete ${selected.name}?`} />
                    <Stack direction="row">
                      <IconButton onClick={handleClear} color="inherit">
                        <CloseSharp />
                      </IconButton>
                      <IconButton onClick={handleDelete} color="inherit">
                        <DoneSharp />
                      </IconButton>
                    </Stack>
                  </Stack>
                </NavAnimation>
              ) : (
                <PanDownAnimation>
                  <DText text={`Selected: ${selected.name}`} color="primary" />
                </PanDownAnimation>
              )
            ) : (
              <NavAnimation>
                <DText text="Idle" color="warning.main" />
              </NavAnimation>
            )}
          </NavAnimation>
        </Grid>
        <Grid xs display="flex" justifyContent="end">
          <TippedIconButton
            tooltip="Minimise"
            onClick={e => kernel.trigger('appbar', 'min')}
            color="primary"
          >
            <CloseFullscreenSharp />
          </TippedIconButton>
        </Grid>
      </Grid>
    </Box>
  );
};
