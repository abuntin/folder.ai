'use client';

import {
  AddSharp,
  AddToDriveSharp,
  CallMadeSharp,
  CreateNewFolderSharp,
  DriveFolderUploadSharp,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButtonProps,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import { DText, TippedIconButton } from 'components/common';
import { borderRadius, margin } from 'lib/constants';
import * as React from 'react';
import { useDashboard } from './Context';

export const AddButton: React.FC<IconButtonProps> = props => {
  const { useUpload, kernel } = useDashboard();

  const { handleAdd } = useUpload();

  const hiddenFileInput = React.useRef(null);

  const [anchorEl, setAnchorEl] = React.useState(null);

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
        <MenuItem onClick={handleClose} divider>
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <CreateNewFolderSharp sx={{ fontSize: 30 }} color="disabled" />
            <DText variant="subtitle1" text="Create New Folder" />
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
            <DText variant="subtitle1" text="Upload new Files" />
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

      {/* <UploadPane open={uploadPane} toggle={toggleUploadPane} /> */}
    </Box>
  );
};
