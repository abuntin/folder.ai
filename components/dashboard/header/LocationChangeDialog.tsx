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
import { useKernel } from 'components/app';

interface LocationChangeDialogProps extends DialogProps {
  type: 'copy' | 'move';
}

export const LocationChangeDialog: React.FC<
  LocationChangeDialogProps
> = props => {
  const { selected, useKernelApi } = useKernel();

  const { folderActions } = useKernelApi();

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
        elevation: 2,
      }}
    >
      <Stack spacing={4}>
        <DText
          text={`${action} ${selected.name} to:`}
          variant="h6"
          fontWeight="regular"
        />
        <FolderSelect
          onChange={(e, value, reason) => {
            if (reason == 'clear') setDestination(null);
            else if (reason == 'selectOption') setDestination(value.folder);
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
