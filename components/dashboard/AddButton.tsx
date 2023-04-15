'use client';

import {
  Box,
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
  Divider,
  Stack,
} from '@mui/material';
import { AddSharp, AddToDriveSharp, CallMadeSharp, CreateNewFolderSharp, DriveFolderUploadSharp } from '@mui/icons-material';
import * as React from 'react';
import { useDashboard } from './Context';
import { DText, TippedIconButton } from 'components/common';
import { borderRadius } from 'lib/constants';

export const AddButton: React.FC<IconButtonProps> = props => {
  const { useUpload, kernel } = useDashboard();

  const { uploadPane, toggleUploadPane } = useUpload();

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

  // dw-ui-service-account@folder-ai.iam.gserviceaccount.com

  // trunk-ignore(gitleaks/private-key)
  //-----BEGIN PRIVATE KEY-----MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCzM6g99tyHVahQqqcTszDoweGmzCvfS2Llrsc+3JeKjGyEr+01N9MTJfIPf3IbmHiPuO6pt0OHfTpJweNFhi06d9J8r9PShgAbYdIm9QZJDa4uCgiiAxDncxBpA6UurcZg6ApF6LZeIFKvAp1BOL3BsHF890vJQlK1dVvwRwxI3fSjhwmbSYdvEd1F6vcjBI8+mdzPEfKps4o9aNQ8pvxxum+IMNzMWKTtmurRxIvuUFb8oZcepga/RgrD+cIP8FklNlZN/7E6mG/VpAxq+Co2IFeVa0uWvOSIx0TfYiHuEFFWH8nJTEFxqPqrsovA6oJxhIRab7SznD3qzz4vGLAfAgMBAAECggEAK5Cw45OKrFoOJ8I9CQSErOlJju/O8KOWoOj7JlShgLy/uwg7/jaamWqdrNfaaUwJb0NRvi+/+oXesESzGFlU0ISFxutF70XFa+K9oNvrkcICKM4mqCBfsSzfffA1baIweqmeqb037K0l/McBbPQ66YYYKP3DzmNR0Sx9U+4p1eK7pGjrKJMflcukzR+xdU21yQNUbafKKbHSbQ2TH0NtNlHgvvCnlZ1+Zw/0P6IfP8aAbnudK0p3QN4pc02QQHXysyIhjoEymEwdMSTt0d+Eq2IPoL3Suju0/PrHJ7sxfDZpgfDOqYrGCAmVxn+GroXp3u+9nLk6fIfdDJ9T1GY8WQKBgQDbp3dXYYYvMI2ycBpIDaG/sslC8T9QNZL8WXt7N9IdMVaefpDcC4beLygt18BdpHc0LgoKpwKR87swOn4c6wpfRSd5rmpt8jbjnMBHKfYvROi+KHVOVOJIVLqdk/iyUF0AvP0eVbWVTu+n4XhC8w/0oIf6/+d8CzGd5m3qSa/nZwKBgQDQ2qGdXJn930t+o/cHQ3tUKHU1Ws10pQWM53hW3EBl6WOx6s8ANemEJmzWGOJ25oNa0c4IOROPenMbv6vfJgD5tIh73nfhm1PfzX2ewjo7nd6wI/90JmELuAKHU9ugU7fNX/w74yPkGED+qF41haCjq8N+v929HdWSKrpaIHUWiQKBgQDPI6c0fSCYYdZOXs86Abj2WXjYqz7EujEJzqzW7zYzF3MS9lJPYINoBdqDGMIszMspJv2LPCH9V3bALXj+dlyKqWFnq6ZsVo2SqiDdO2IRA4/ku6ycGQpnoZd2wLM4HPcHmjGtKLCbxBvXGpZZtHPognaZqjg3TysUN9iRp7m9owKBgGbKY+ZuEABJ6P8gNdFmXgmSi/VBhoMVQQETXz/o0O0XjBChz1V8MzzuKHzK7JK2awnE3tFfPghMrOCIWk/OhYZgWxgT6w6ngwVQPrZnQ3/Z+CLa5LxGs1awLtZp6FslOP4kcqEK7rwxT7PGK+/Nn71OKT51se2FBHsW+nanKNl5AoGBAJdqkvYodUWsOF/ZQRyTQEQYXMlwg1Nn6K0NSja7gioSfdxRLxSlHN0oZTP/Aa8dsqVFG0ibJg2+Kgz+UuCgXAQ7jM0lCz5e2DWSngEG0QFLcV/R5Xh3PeEtMosduCYG39+vaBZySGuMkh/0Lc79ZKvwGFHAiMlWTc0C0QIgMx3Y-----END PRIVATE KEY-----
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
    >

      <TippedIconButton {...props} onClick={handleClick} tooltip='Add New'>
        <AddSharp sx={{ fontSize: 20 }} color="primary"/>
      </TippedIconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ minWidth: '60%', borderRadius, backgroundColor: 'secondary.main' }}
      >
        <MenuItem onClick={handleClose}>
          <Stack direction="row" spacing={1}>
            <CreateNewFolderSharp sx={{ fontSize: 40 }} color="disabled" />
            <Divider flexItem orientation='vertical' />
            <DText variant="subtitle1" text="Create New Folder" />
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Stack direction="row" spacing={1}>
            <DriveFolderUploadSharp sx={{ fontSize: 40 }} color="disabled" />
            <Divider flexItem orientation='vertical' />
            <DText variant="subtitle1" text="Upload new Files - You can also drag and drop files directly into Directories!" />
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Stack direction="row" spacing={1}>
            <AddToDriveSharp sx={{ fontSize: 40 }} color="disabled" />
            <Divider flexItem orientation='vertical' />
            <DText variant="subtitle1" text="Import from Google Docs" />
            <CallMadeSharp sx={{ fonSize: 20 }} />
          </Stack>
        </MenuItem>
      </Menu>

      {/* <UploadPane open={uploadPane} toggle={toggleUploadPane} /> */}
    </Box>
  );
};
