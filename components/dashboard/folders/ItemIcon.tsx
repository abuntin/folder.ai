'use client';

import { Box, BoxProps } from '@mui/material';
import {
  FolderSharp,
  FolderOpenSharp,
  SnippetFolderSharp,
} from '@mui/icons-material';
import { AppearAnimationChild, FolderAnimation } from 'components/animation';
import { DText } from 'components/common';
import { padding, borderRadius, margin } from 'lib/constants';
import { Folder } from 'lib/models';
import * as React from 'react';
import { useDashboard } from '../context';
import { ProgressBar } from '../ProgressBar';

interface DashboardItemProps extends BoxProps {
  folder: Folder;
  selected: boolean;
}

export const DashboardItemIcon: React.FC<DashboardItemProps> = props => {
  const { folder, selected, ...rest } = props;

  const { useUpload, kernel } = useDashboard();

  const { dragOver, handleDrag, handleDrop } = useUpload();

  return (
    <AppearAnimationChild>
      <FolderAnimation>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            paddingBottom: padding,
            paddingTop: padding,
            backgroundColor:
              selected || dragOver ? 'background.paper' : 'transparent',
            borderRadius,
            '&:hover': { backgroundColor: 'background.paper' },
          }}
          onDrop={e => handleDrop(e, kernel, kernel.current)}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          {...rest}
        >
          <form action="" onSubmit={e => e.preventDefault()}>
            <input
              type="file"
              style={{ display: 'none' }}
              name="file"
              multiple
            />
          </form>

          {folder.isDirectory ? (
            folder.children ? (
              <FolderSharp color="info" sx={{ fontSize: 120 }} />
            ) : (
              <FolderOpenSharp
                fontSize="large"
                color="primary"
                sx={{ mb: margin * 2, mt: margin * 2, fontSize: 60 }}
              />
            )
          ) : (
            <SnippetFolderSharp
              color="primary"
              sx={{ mb: margin * 2, mt: margin * 2, fontSize: 60 }}
            />
          )}
          <DText
            text={folder.name}
            variant="subtitle2"
            color={theme => theme.palette.common.white}
            fontWeight="regular"
          />
        </Box>
      </FolderAnimation>
    </AppearAnimationChild>
  );
};
