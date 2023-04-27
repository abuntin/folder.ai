'use client';

import {
  FolderOpenSharp,
  FolderSharp,
  SnippetFolderSharp,
} from '@mui/icons-material';
import { Stack } from '@mui/material';
import { itemVariant } from 'components/animation';
import { useKernel } from 'components/app';
import { m } from 'framer-motion';
import { margin } from 'lib/constants';
import { TreeNode as Node } from 'lib/models';
import * as React from 'react';
import { DText } from './DText';
import { LoadingComponent } from './Loading';
import { Tree } from './Tree';

interface TreeNodeProps {
  node: Node;
  level: number;
  isActive: boolean;
  open: boolean;
  handleClick: (e: React.SyntheticEvent) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = props => {

  let { loading } = useKernel();

  const { node, level, isActive, open, handleClick } = props;

  let { isDirectory, name } = node.folder;

  let children = Object.values(node.children);

  const getItemIcon = isDirectory ? (
    children.length ? (
      <FolderSharp
        color={isActive ? 'info' : 'primary'}
        sx={{ fontSize: 18 }}
      />
    ) : (
      <FolderOpenSharp
        fontSize="large"
        color="primary"
        sx={{ mb: margin * 2, mt: margin * 2, fontSize: 18 }}
      />
    )
  ) : (
    <SnippetFolderSharp
      color={isActive ? 'info' : 'primary'}
      sx={{ mb: margin * 2, mt: margin * 2, fontSize: 18 }}
    />
  );

  return (
    <m.li variants={itemVariant}>
      <div onClick={handleClick} style={{ marginBottom: '10px' }}>
        <Stack spacing={1} direction="row" sx={{ ml: level * margin }}>
          {getItemIcon}
          <DText text={name} variant="body2" />
        </Stack>
      </div>
      <ul style={{ paddingLeft: '10px', borderLeft: '1px solid black' }}>
        {
          open ? (
            children.length ? <Tree nodes={children} level={level + 1} />
            : loading ? <LoadingComponent height={50} width={50} />
            : <DText text="Nothing to see here" variant='body2' />
          ) : null
        }
      </ul>
    </m.li>
  );
};
