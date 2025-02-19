'use client';

import {
  DialogProps,
  Dialog,
  Button,
  DialogActions,
  Stack,
} from '@mui/material';
import { DText, FolderSelect } from 'components/common';
import { borderRadius, padding, margin } from 'lib/constants';
import { Folder } from 'lib/models';
import * as React from 'react';
import { useDashboard } from '../context';

interface LocationChangeDialogProps extends DialogProps {
  type: 'copy' | 'move';
}

export const LocationChangeDialog: React.FC<LocationChangeDialogProps> = props => {
  const { kernel, selected, useDashboardApi } = useDashboard();

  const { folderActions } = useDashboardApi();

  const [destination, setDestination] = React.useState<Folder>(null);

  const action =
    props.type.charAt(0).toUpperCase() + props.type.slice(1, props.type.length);

  const { handlePaste, handleMove } = folderActions;

  const onPaste = (e: React.SyntheticEvent) => handlePaste(e, destination);

  const onMove = (e: React.SyntheticEvent) => handleMove(e, destination);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      PaperProps={{
        sx: {
          borderRadius: borderRadius * 3,
          padding: padding * 3,
          backgroundColor: 'action.active',
        },
        elevation: 2
      }}
    >
      <Stack spacing={4}>
        <DText
          text={`${action} ${selected.name} to:`}
          variant="h6"
          fontWeight="regular"
        />
        <FolderSelect
          options={kernel.folders.filter(
            (folder: Folder) => folder.isDirectory
          )}
          onChange={(e, value, reason) => {
            if (reason == 'selectOption') setDestination(value);
            else if (reason == 'clear') setDestination(null);
            else return;
          }}
        />
        <DialogActions>
          <Button onClick={e => props.onClose(e, 'backdropClick')}>
            <DText text="Cancel" />{' '}
          </Button>
          <Button
            onClick={props.type == 'copy' ? onPaste : onMove}
            disabled={!destination}
          >
            <DText text={action} />{' '}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};
