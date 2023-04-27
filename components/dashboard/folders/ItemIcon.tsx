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
import { TreeNode, Folder } from 'lib/models';
import * as React from 'react';
import { useKernel } from 'components/app';

interface DashboardItemProps extends BoxProps {
  node: TreeNode;
  selected: boolean;
}

export const DashboardItemIcon: React.FC<DashboardItemProps> = props => {
  const { node, selected, ...rest } = props;

  const { folder } = node;

  const { name, isDirectory, children } = folder;

  const { useUpload, kernel } = useKernel();

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
              selected || (dragOver && isDirectory)
                ? 'background.paper'
                : 'transparent',
            borderRadius,
            '&:hover': { backgroundColor: 'background.paper' },
          }}
          onDrop={isDirectory ? e => handleDrop(e, kernel, folder) : undefined}
          onDragEnter={isDirectory ? handleDrag : undefined}
          onDragOver={isDirectory ? handleDrag : undefined}
          onDragLeave={isDirectory ? handleDrag : undefined}
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

          {isDirectory ? (
            children ? (
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
            text={name}
            variant="subtitle2"
            color={theme => theme.palette.common.white}
            fontWeight="regular"
          />
        </Box>
      </FolderAnimation>
    </AppearAnimationChild>
  );
};
