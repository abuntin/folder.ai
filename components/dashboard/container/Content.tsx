'use client';

import {
  FolderSharp,
  KeyboardArrowLeft,
  SnippetFolderSharp
} from '@mui/icons-material';
import {
  Box, IconButton,
  Unstable_Grid2 as Grid,
  useTheme
} from '@mui/material';
import { useDashboard } from 'components';
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
  const { view, kernel, selected, useUpload } = useDashboard();

  let { current, folders } = kernel;

  const { parentDragOver, handleDrag, handleDrop, isDialog } = useUpload();

  const handleSelect = (e: React.SyntheticEvent, folder: Folder) => {
    kernel.trigger('select', folder);
  };

  const handleNavigate = (e: React.SyntheticEvent, folder: Folder) => {
    if (folder.isDirectory) kernel.trigger('load', folder);
  };

  const FolderComponent = React.useMemo(
    () =>
      view === 'tile'
        ? dynamic(() =>
            import('../folders').then(_ => _.DashboardItemTile)
          )
        : dynamic(() =>
            import('../folders').then(_ => _.DashboardItemIcon)
          ),
    [view, kernel.folders]
  );

  const handleKeyPress = React.useMemo(() => {
    let index = selected ? folders.indexOf(selected) : -1;
    if (view == 'tile') {
      return (e: React.KeyboardEvent<HTMLDivElement>) => {
        console.log(e.key);
        if (e.key == 'ArrowDown') {
          if (index == -1 || index == folders.length - 1)
            kernel.trigger('select', folders[0]);
          else kernel.trigger('select', folders[index + 1]);
        } else if (e.key == 'ArrowUp') {
          if (index == -1 || index == 0)
            kernel.trigger('select', folders[folders.length - 1]);
          else kernel.trigger('select', folders[index - 1]);
        } else if (e.key == 'Enter' && selected && selected.isDirectory) {
          handleNavigate(e, selected);
        }
      };
    } else
      return (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key == 'ArrowRight') {
          if (index == -1 || index == folders.length - 1)
            kernel.trigger('select', folders[0]);
          else kernel.trigger('select', folders[index + 1]);
        } else if (e.key == 'ArrowLeft') {
          if (index == -1 || index == 0)
            kernel.trigger('select', folders[folders.length - 1]);
          else kernel.trigger('select', folders[index - 1]);
        } else if (e.key == 'Enter' && selected && selected.isDirectory) {
          handleNavigate(e, selected);
        }
      };
  }, [view, folders, selected]);

  return (
    <Grid
      xs={12}
      container
      spacing={view === 'grid' ? 6 : 2}
      sx={{
        mt: margin * 2,
        mb: margin * 2,
        borderRadius,
        backgroundColor: parentDragOver
          ? 'background.paper'
          : 'background.default',
        padding,
      }}
      onDrop={isDialog ? undefined : e => handleDrop(e, kernel, current)}
      onDragEnter={isDialog ? undefined : e => handleDrag(e, 'container')}
      onDragOver={isDialog ? undefined : e => handleDrag(e, 'container')}
      onDragLeave={isDialog ? undefined : e => handleDrag(e, 'container')}
      //onClick={e => kernel.trigger('select', null)}
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
                text={kernel.current.name}
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
                  text={kernel.foldersExcl.length}
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
                text={kernel.directoriesExcl.length}
                variant="h6"
                fontWeight="medium"
              />
              <FolderSharp color="primary" sx={{ fontSize: 18 }} />
            </Box>
          </m.div>
        </Grid>
        <Grid xs={4} />
      </Grid>

      {!folders.length && (
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
      {folders.length !== 0 &&
        folders.map((folder: Folder, i) => {
          return (
            <Grid
              key={i}
              xs={view === 'grid' ? 4 : 12}
              onDoubleClick={e => handleNavigate(e, folder)}
              onClick={e => handleSelect(e, folder)}
              onKeyDown={handleKeyPress}
            >
              <HoverAnimation>
                <FolderComponent
                  selected={selected && selected.id === folder.id}
                  folder={folder}
                />
              </HoverAnimation>
            </Grid>
          );
        })}
    </Grid>
  );
};
