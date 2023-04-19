'use client';

import {
  AddSharp,
  AddToDriveSharp,
  CallMadeSharp,
  CreateNewFolderSharp,
  DriveFolderUploadSharp,
} from '@mui/icons-material';
import { Box, IconButtonProps, Menu, MenuItem, Stack } from '@mui/material';
import { DText, TippedIconButton, FormDialog } from 'components/common';
import { borderRadius, margin } from 'lib/constants';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useDashboard } from '../context';
import { CreateNewDirectoryDialog } from './CreateNewDirectoryDialog';
import { UploadFolderDialog } from './UploadFolderDialog';

export const AddButton: React.FC<IconButtonProps> = props => {
  const { useUpload, kernel } = useDashboard();

  const { folders, current } = kernel;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [isPending, startTransition] = React.useTransition();

  const [dialog, setDialogState] = React.useState<'create' | 'upload' | null>(
    null
  );

  const [uploadDialog, setUploadDialogState] = React.useState(false);

  const [newDirectoryName, setDirName] = React.useState('');

  const setDialog = (state: typeof dialog) =>
    startTransition(() => setDialogState(state));

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (e: React.SyntheticEvent) => {
    setAnchorEl(e.currentTarget);
  };

  const createNewDirectoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setDirName(e.target.value);

  const CreateNewDialog = React.useMemo(
    () =>
      folders && current && dialog
        ? dynamic(() =>
            import('components/common/FormDialog').then(_ => _.FormDialog)
          )
        : React.Fragment,
    [kernel, dialog]
  );

  const dialogProps = React.useMemo(
    () =>
      dialog == 'create'
        ? {
            open: dialog != null,
            value: newDirectoryName,
            title: 'New Folder.AI Directory',
            handleClose: e => setDialog(null),
            error: (value: string) => {
              let isError =
                folders.filter(folder => folder.name == value).length !== 0;
              return isError ? 'Directory already exists' : '';
            },
            inputChange: createNewDirectoryInputChange,
            onConfirm: e =>
              kernel.trigger('create', { name: newDirectoryName }),
            inputLabel: 'Directory Name',
            content: <CreateNewDirectoryDialog />,
            textfield: true,
          }
        : dialog == 'upload'
        ? {
            open: dialog != null,
            title: 'Upload New Folders',
            handleClose: e => setDialog(null),
            onConfirm: e => {},
            inputLabel: 'Directory Name',
            content: <UploadFolderDialog />,
            textfield: false,
            actions: false,
          }
        : null,
    [dialog]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <TippedIconButton {...props} onClick={handleClick} tooltip="Add New">
        <AddSharp sx={{ fontSize: 20 }} color="primary" />
      </TippedIconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{ minWidth: '60%', borderRadius: borderRadius * 2, mt: margin * 4 }}
        MenuListProps={{ sx: { backgroundColor: 'action.active' } }}
      >
        <MenuItem onClick={e => setDialog('create')} divider>
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <CreateNewFolderSharp sx={{ fontSize: 30 }} color="disabled" />
            <DText variant="subtitle1" text="Create New Directory" />
          </Stack>
        </MenuItem>
        <MenuItem onClick={e => setDialog('upload')} divider>
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <DriveFolderUploadSharp sx={{ fontSize: 30 }} color="disabled" />
            <DText variant="subtitle1" text="Upload new Folders" />
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleClose} disabled>
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <AddToDriveSharp sx={{ fontSize: 30 }} color="disabled" />
            <DText variant="subtitle1" text="Import from Google Docs" />
            <CallMadeSharp sx={{ fonSize: 20 }} />
          </Stack>
        </MenuItem>
      </Menu>
      <CreateNewDialog {...dialogProps} />
    </Box>
  );
};
