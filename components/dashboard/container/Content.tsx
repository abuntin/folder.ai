'use client';

import {
  FolderSharp,
  KeyboardArrowLeft,
  SnippetFolderSharp,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Unstable_Grid2 as Grid,
  useTheme,
} from '@mui/material';
import { useKernel } from 'components/app';
import { HoverAnimation } from 'components/animation';
import { DText } from 'components/common';
import { m } from 'framer-motion';
import { borderRadius, margin, padding } from 'lib/constants';
import { Folder } from 'lib/models';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { ItemIconSkeleton } from '../folders';

interface ContentProps {}

export const Content: React.FC<ContentProps> = props => {
  const theme = useTheme();
  const { view, kernel, selected, useUpload, loading } = useKernel();

  let { currentDirectory, isRoot } = kernel;

  const { dragOver, handleDrag, handleDrop } = useUpload();

  const handleSelect = (e: React.SyntheticEvent, folder: Folder) => {
    kernel.trigger('select', folder);
  };

  const handleNavigate = (e: React.SyntheticEvent, folder: Folder) => {
    if (folder.isDirectory)
      kernel.trigger('load', folder.path, 'folders', true);
  };

  const FolderComponent = React.useMemo(
    () =>
      view === 'tile'
        ? dynamic(() => import('../folders').then(_ => _.DashboardItemTile))
        : dynamic(() => import('../folders').then(_ => _.DashboardItemIcon)),
    [view]
  );

  const DirectoryBar = React.useMemo(
    () => dynamic(() => import('./DirectoryBar').then(_ => _.DirectoryBar)),
    []
  );

  const backButton = React.useMemo(() => {
    if (currentDirectory && !loading.folders && !isRoot)
      return (
        <IconButton onClick={e => kernel.goBack()} color="primary">
          <KeyboardArrowLeft fontSize="medium" />
        </IconButton>
      );
    else return <></>;
  }, [currentDirectory, isRoot, loading]);

  const containerProps = React.useMemo(
    () =>
      currentDirectory && !loading.folders
        ? {
            onDrop: e => handleDrop(e, kernel, currentDirectory.folder),
            onDragEnter: handleDrag,
            onDragOver: handleDrag,
            onDragLeave: handleDrag,
            onClick: e => kernel.trigger('select', null),
            sx: {
              mt: margin * 2,
              mb: margin * 2,
              borderRadius,
              backgroundColor: dragOver
                ? 'background.paper'
                : 'background.default',
              padding,
            },
            spacing: view == 'grid' ? 6 : 2
          }
        : {
            sx: {
              mt: margin * 2,
              mb: margin * 2,
              borderRadius,
              backgroundColor: 'background.paper',
              padding,
            },
            spacing: 6
          },
    [loading.folders, currentDirectory]
  );

  return (
    <Grid
      xs={12}
      container
      {...containerProps}
    >
      <Grid
        xs={12}
        container
        spacing={4}
        display="flex"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <Grid xs={4}>{backButton}</Grid>
        <Grid xs={4} display="flex" justifyContent="center">
          <DirectoryBar />
        </Grid>
        <Grid xs={4} />
      </Grid>

      {(!currentDirectory || loading.folders) &&
        [0, 1, 2].map(i => {
          return (
            <Grid key={i} xs={4}>
              <ItemIconSkeleton />
            </Grid>
          );
        })}
      {currentDirectory &&
        !loading.folders &&
        !currentDirectory.hasChildren && (
          <Grid
            xs={12}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <DText
              text="Nothing to see here yet! Drop some files or create a new Directory"
              variant="body1"
              fontWeight="medium"
            />
          </Grid>
        )}
      {!loading.folders &&
        currentDirectory &&
        currentDirectory.hasChildren &&
        Object.values(currentDirectory.children).map((node, i) => {
          return (
            <Grid
              key={i}
              xs={view === 'grid' ? 4 : 12}
              onDoubleClick={e => handleNavigate(e, node.folder)}
              onClick={e => {
                e.stopPropagation();
                handleSelect(e, node.folder);
              }}
            >
              <HoverAnimation>
                <FolderComponent
                  selected={selected && selected.id === node.folder.id}
                  node={node}
                />
              </HoverAnimation>
            </Grid>
          );
        })}
    </Grid>
  );
};
