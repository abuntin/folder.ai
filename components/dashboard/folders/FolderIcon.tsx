'use client';

import { TreeNode } from 'lib/models';
import { margin } from 'lib/constants';
import { RotateAnimation, BlinkAnimation } from 'components/animation';
import {
  FolderSharp,
  FolderOpenSharp,
  SnippetFolderSharp,
  DataObjectSharp,
  SyncSharp,
} from '@mui/icons-material';
import * as React from 'react';

interface FolderIconProps {
  node: TreeNode;
}

export const InfoIcon = ({ indexing, refreshing }) => {
  let sx = {
    fontSize: 40,
    position: 'absolute',
    right: 10,
    bottom: 25,
  };

  return indexing ? (
    <BlinkAnimation>
      <DataObjectSharp color="warning" sx={sx} />
    </BlinkAnimation>
  ) : refreshing ? (
    <RotateAnimation style={{ width: 'max-content', height: 'max-content' }}>
      <SyncSharp color="warning" sx={sx} />
    </RotateAnimation>
  ) : (
    <> </>
  );
};

export const FolderIcon = ({ folder: { isDirectory, children } }) =>
  isDirectory ? (
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
  );

export const FolderIconContainer: React.FC<FolderIconProps> = ({ node }) => {
  let { folder, refreshing, indexing } = node;

  return (
    <div
      style={{
        position: 'relative',
        padding: 15,
        backgroundColor: 'transparent',
        flexGrow: 1,
        flexBasis: '100%',
        flexShrink: 1
      }}
    >
      <FolderIcon folder={folder} />
      <InfoIcon indexing={indexing} refreshing={refreshing} />
    </div>
  );
};
