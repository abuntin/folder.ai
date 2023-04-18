'use client';

import {
  ArrowForwardSharp,
  CloseSharp,
  DeleteSharp,
  DoneSharp,
} from '@mui/icons-material';
import { Stack, IconButton, Box } from '@mui/material';
import { NavAnimation, PanDownAnimation } from 'components/animation';
import { DText, FolderSelect, TippedIconButton } from 'components/common';
import { Folder } from 'lib/models';
import * as React from 'react';
import { useDashboard, useDashboardApi } from '../context';

interface InfoPaneProps {}

export const ActionInfo: React.FC<InfoPaneProps> = props => {
  const { kernel, selected, useDashboardApi } = useDashboard();

  const { folders } = kernel;

  const { clipboard, folderActions, state } = useDashboardApi();

  const { handlePaste, handleDelete, handleClear, handleMove } = folderActions;

  const { recentAction, setDestination, destination } = state;

  return (
      <Box>
        {clipboard.length ? (
          recentAction && recentAction !== 'delete' ? (
            <NavAnimation
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
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
                  options={folders.filter(
                    (folder: Folder) => folder.isDirectory
                  )}
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
              <Stack
                direction="row"
                spacing={[2, 1, 1]}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <DText text={`Delete ${selected.name}?`} />
                <IconButton onClick={handleClear} color="inherit">
                  <CloseSharp />
                </IconButton>
                <IconButton onClick={handleDelete} color="inherit">
                  <DoneSharp />
                </IconButton>
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
      </Box>
    )
};
