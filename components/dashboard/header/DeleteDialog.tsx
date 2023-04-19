'use client';

import * as React from 'react';
import { useDashboard } from '../context';
import { DText, FormDialogProps } from 'components/common';
import { Dialog, DialogActions, Button } from '@mui/material';
import { borderRadius, padding } from 'lib/constants';

interface MoveDialogProps extends FormDialogProps {}

export const DeleteDialog: React.FC<MoveDialogProps> = props => {
  const { selected, useDashboardApi } = useDashboard();

  const { folderActions } = useDashboardApi();

  const { handleDelete } = folderActions;

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
      }}
    >
      <DText text={`Delete ${selected.name}?`} variant="subtitle1" fontWeight="regular" />
      <DialogActions>
        <Button onClick={e => props.onClose(e, 'backdropClick')}>
          <DText text="Cancel" />{' '}
        </Button>
        <Button color='error' onClick={handleDelete}>
          <DText text="Delete" />{' '}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
