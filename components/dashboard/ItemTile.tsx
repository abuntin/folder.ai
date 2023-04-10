'use client';

import {
  KeyboardArrowRightSharp,
  FolderSharp,
  FolderOpenSharp,
  InsertDriveFileSharp,
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
import { DText, useDashboard } from 'components';

interface DashboardItemTileProps extends BoxProps {
  folder: Folder;
  selected: boolean;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface EditButtonProps extends IconButtonProps {}

const ExpandMoreButton = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const EditButton = styled((props: EditButtonProps) => {
  const { disabled, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, disabled }) => ({}));

export const DashboardItemTile: React.FC<DashboardItemTileProps> = props => {
  const { folder, selected } = props;

  const { name } = folder;

  const { useUpload, kernel } = useDashboard();

  const { dragOver, handleDrag, handleDrop, uploadProgress } = useUpload();

  return (
    <Box
      sx={{
        backgroundColor:
          selected || dragOver ? 'background.paper' : 'transparent',
        '&:hover': { backgroundColor: 'background.paper' },
      }}
      onDrop={e => handleDrop(e, kernel, folder)}
      onDragEnter={e => handleDrag(e, true)}
      onDragOver={e => handleDrag(e, true)}
      onDragLeave={e => handleDrag(e, true)}
    >
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
                <FolderSharp fontSize="large" color="primary" />
              ) : (
                <FolderOpenSharp fontSize="large" color="disabled" />
              )
            ) : (
              <InsertDriveFileSharp fontSize="large" color="disabled" />
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
                <ExpandMoreButton expand={selected}>
                  <KeyboardArrowRightSharp />
                </ExpandMoreButton>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
