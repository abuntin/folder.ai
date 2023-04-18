'use client';

import {
  AddSharp,
  AddToDriveSharp,
  CallMadeSharp,
  CreateNewFolderSharp,
  DriveFolderUploadSharp,
  StarRateOutlined,
} from '@mui/icons-material';
import { Box, IconButtonProps, Menu, MenuItem, Stack } from '@mui/material';
import { DText, TippedIconButton } from 'components/common';
import { borderRadius, margin } from 'lib/constants';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useDashboard } from './context';
import { FormDialog } from './FormDialog';

export const AddButton: React.FC<IconButtonProps> = props => {
  const { useUpload, kernel } = useDashboard();

  const { folders, current } = kernel;

  const { handleAdd } = useUpload();

  const hiddenFileInput = React.useRef(null);

  const [isPending, startTransition] = React.useTransition();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [createDialog, setCreateDialogState] = React.useState(false);

  const [newDirectoryName, setDirName] = React.useState('');

  const setCreateDialog = (state: boolean) =>
    startTransition(() => setCreateDialogState(state));

  const handleClick = (e: React.SyntheticEvent) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const nativeOnChange = e => {
    const detail = {
      selectedIndex: e.target.selectedIndex,
    };
    e.target.selectedIndex = 0;

    e.target.dispatchEvent(new CustomEvent('itemClick', { detail }));
  };

  const itemClick = e => {
    console.log('Item Clicked ' + e.detail);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAdd(e, kernel);
    handleClose();
  };

  const handleUpload = (e: React.SyntheticEvent) =>
    hiddenFileInput.current.click();

  const createNewDirectoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setDirName(e.target.value);

  const CreateNewDirectory = React.useMemo(() => (
    folders && current ? dynamic(() => import('./FormDialog').then(_ => _.FormDialog))
    : React.Fragment
  ), [kernel])

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
        MenuListProps={{ sx: { backgroundColor: 'secondary.main' } }}
      >
        <MenuItem onClick={e => setCreateDialog(true)} divider>
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <CreateNewFolderSharp sx={{ fontSize: 30 }} color="disabled" />
            <DText variant="subtitle1" text="Create New Directory" />
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleUpload} divider>
          <input
            multiple
            ref={hiddenFileInput}
            type="file"
            style={{ display: 'none' }}
            onChange={handleChange}
          />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <DriveFolderUploadSharp sx={{ fontSize: 30 }} color="disabled" />
            <DText variant="subtitle1" text="Upload new Folders" />
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleClose}>
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
      <CreateNewDirectory
        open={createDialog}
        value={newDirectoryName}
        title="Create a new Folder.AI Directory"
        description="Folder.AI uses Directories to organise your Folders. Once created and indexed, you can perform full text and semantic search, chat to valid* documents, and more!"
        handleClose={e => setCreateDialog(false)}
        error={(value: string) => {
          let isError = folders.filter(folder => folder.name == value).length !== 0
          return isError ? 'Directory already exists' : ''
        }}
        inputChange={createNewDirectoryInputChange}
        onConfirm={e => kernel.trigger('create', { name: newDirectoryName })}
        inputLabel='Directory Name'
      />
    </Box>
  );
};
