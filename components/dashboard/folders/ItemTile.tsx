'use client';

import {
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
import { TreeNode } from 'lib/models';
import * as React from 'react';
import { DText, ExpandMoreButton } from 'components/common';
import { AppearAnimationChild } from 'components/animation';
import { useKernel } from 'components/app';

interface DashboardItemTileProps extends BoxProps {
  node: TreeNode;
  selected: boolean;
}

export const DashboardItemTile: React.FC<DashboardItemTileProps> = props => {
  const { node, selected, ...rest } = props;

  const { folder } = node;

  const { name, isDirectory, children } = folder;

  const { useUpload, kernel } = useKernel();

  const { dragOver, handleDrag, handleDrop } = useUpload();

  return (
    <AppearAnimationChild>
      <Box
        sx={{
          backgroundColor:
            selected || (dragOver && isDirectory)
              ? 'background.paper'
              : 'transparent',
          '&:hover': { backgroundColor: 'background.paper' },
        }}
        onDrop={isDirectory ? e => handleDrop(e, kernel, folder) : undefined}
        onDragEnter={isDirectory ? handleDrag : undefined}
        onDragOver={isDirectory ? handleDrag : undefined}
        onDragLeave={isDirectory ? handleDrag : undefined}
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
              {isDirectory ? (
                children ? (
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
              {isDirectory && (
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
