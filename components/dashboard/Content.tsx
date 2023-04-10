'use client';

import { KeyboardArrowLeft } from '@mui/icons-material';
import { IconButton, Unstable_Grid2 as Grid } from '@mui/material';
import { useDashboard } from 'components';
import { HoverAnimation } from 'components/animation';
import { DText } from 'components/common';
import { borderRadius, margin, padding } from 'lib/constants';
import { Folder } from 'lib/models';
import dynamic from 'next/dynamic';
import * as React from 'react';

interface ContentProps {}

export const Content: React.FC<ContentProps> = props => {
  const { view, kernel, selected } = useDashboard();

  const handleSelect = (e: React.SyntheticEvent, folder: Folder) => {
    kernel.trigger('select', folder);
  };

  const handleNavigate = (e: React.SyntheticEvent, folder: Folder) => {
    if (folder.isDirectory) kernel.trigger('load', folder);
  };

  const FolderComponent = React.useMemo(
    () =>
      view === 'tile'
        ? dynamic(() => import('./ItemTile').then(_ => _.DashboardItemTile))
        : dynamic(() => import('./ItemIcon').then(_ => _.DashboardItemIcon)),
    [view, kernel.folders]
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
        backgroundColor: 'background.default',
        padding,
      }}
    >
      <Grid
        xs={12}
        container
        spacing={4}
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid xs={2}>
          {!kernel.isRoot && (
            <IconButton onClick={e => kernel.goBack()} color="secondary">
              <KeyboardArrowLeft fontSize="medium" />
            </IconButton>
          )}
        </Grid>
        <Grid xs={2} display="flex" justifyContent="flex-start">
          <DText text={kernel.current.name} variant="h6" fontWeight="medium" />
        </Grid>
        <Grid xs />
      </Grid>

      {kernel.folders.map((folder: Folder, i) => {
        return (
          <Grid
            key={i}
            xs={view === 'grid' ? 4 : 12}
            onDoubleClick={e => handleNavigate(e, folder)}
            onClick={e => handleSelect(e, folder)}
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
