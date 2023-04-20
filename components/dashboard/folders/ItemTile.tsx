'use client';

import {
  KeyboardArrowRightSharp,
  FolderSharp,
  FolderOpenSharp,
  SnippetFolderSharp,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  IconButtonProps,
  BoxProps,
  styled,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { Folder } from 'lib/models';
import * as React from 'react';
import {
  DText,
  useDashboard,
  ExpandMoreButton,
  AppearAnimationChild,
} from 'components';

interface DashboardItemTileProps extends BoxProps {
  folder: Folder;
  selected: boolean;
}

interface EditButtonProps extends IconButtonProps {}

const EditButton = styled((props: EditButtonProps) => {
  const { disabled, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, disabled }) => ({}));

export const DashboardItemTile: React.FC<DashboardItemTileProps> = props => {
  const { folder, selected, ...rest } = props;

  const { name } = folder;

  const { useUpload, kernel } = useDashboard();

  const { dragOver, handleDrag, handleDrop } = useUpload();

  return (
    <AppearAnimationChild>
      <Box
        sx={{
          backgroundColor:
            selected || dragOver ? 'background.paper' : 'transparent',
          '&:hover': { backgroundColor: 'background.paper' },
        }}
        onDrop={e => handleDrop(e, kernel, kernel.current)}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        {...rest}
      >
        <form action="" onSubmit={e => e.preventDefault()}>
          <input type="file" style={{ display: 'none' }} name="file" multiple />
        </form>
        <Grid
          container
          spacing={2}
          direction="column"
          display="flex"
          justifyContent="space-between"
        >
          <Grid xs={12} container>
            <Grid xs={1}>
              {folder.isDirectory ? (
                folder.children ? (
                  <FolderSharp fontSize="large" color="info" />
                ) : (
                  <FolderOpenSharp fontSize="large" color="info" />
                )
              ) : (
                <SnippetFolderSharp fontSize="large" color="primary" />
              )}
            </Grid>
            <Grid xs={8}>
              <DText
                text={name}
                fontWeight={folder.isDirectory ? 'bold' : 'regular'}
                color="common.white"
              />
            </Grid>
            <Grid xs={3} container display="flex" justifyContent="end">
              {folder.isDirectory && (
                <Grid
                  xs={6}
                  display="flex"
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <ExpandMoreButton expand={false} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </AppearAnimationChild>
  );
};
