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

interface ContentProps {}

export const Content: React.FC<ContentProps> = props => {
  const theme = useTheme();
  const { view, kernel, selected, useUpload } = useKernel();

  let { currentDirectory } = kernel;

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
    [view, kernel.folderTree]
  );

  return (
    <Grid
      xs={12}
      container
      spacing={view === 'grid' ? 6 : 2}
      sx={{
        mt: margin * 2,
        mb: margin * 2,
        borderRadius,
        backgroundColor: dragOver ? 'background.paper' : 'background.default',
        padding,
      }}
      onDrop={e => handleDrop(e, kernel, kernel.currentDirectory.folder)}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onClick={e => {
        kernel.trigger('select', null);
      }}
    >
      <Grid
        xs={12}
        container
        spacing={4}
        display="flex"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <Grid xs={4}>
          {!kernel.isRoot && (
            <IconButton onClick={e => kernel.goBack()} color="primary">
              <KeyboardArrowLeft fontSize="medium" />
            </IconButton>
          )}
        </Grid>
        <Grid xs={4} display="flex" justifyContent="center">
          <m.div
            initial="false"
            animate="enter"
            transition={{ ease: 'easeInOut' }}
            aria-label="Current Directory"
            whileHover={{ scale: 1.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.info.main,
              borderRadius: borderRadius * 3,
              paddingLeft: padding * 10,
              paddingRight: padding * 10,
              paddingTop: padding * 5,
              paddingBottom: padding * 5,
            }}
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <DText
                text={kernel.currentDirectory.folder.name}
                variant="h6"
                fontWeight="medium"
              />
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                ml={margin * 4}
              >
                <DText
                  text={kernel.currentFoldersExcl.length}
                  variant="h6"
                  fontWeight="medium"
                />
                <SnippetFolderSharp color="primary" sx={{ fontSize: 18 }} />
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              ml={margin}
            >
              <DText
                text={kernel.currentDirectoriesExcl.length}
                variant="h6"
                fontWeight="medium"
              />
              <FolderSharp color="primary" sx={{ fontSize: 18 }} />
            </Box>
          </m.div>
        </Grid>
        <Grid xs={4} />
      </Grid>

      {!currentDirectory.hasChildren && (
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
      {currentDirectory.hasChildren &&
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
