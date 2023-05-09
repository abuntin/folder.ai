'use client';

import { BlinkAnimation, listVariant } from 'components/animation';
import { useKernel } from 'components/app';
import { m } from 'framer-motion';
import * as React from 'react';
import { TreeProvider } from './context';
import { TreeNode, TreeNodeSkeleton } from './TreeNode';
import { TreeNode as Node } from 'lib/models';
import { useQuery } from 'components/query/context';

interface TreeRootProps {}

export const TreeRootSkeleton: React.FC<TreeRootProps> = ({ ...rest }) => (
  <m.ul
    initial="hidden"
    animate="visible"
    variants={listVariant}
    style={{ maxHeight: '100%' }}
  >
    <TreeNodeSkeleton level={0} />
  </m.ul>
);

export const TreeRoot: React.FC<TreeRootProps> = ({ ...rest }) => {
  const { rootDirectory } = useQuery();

  return (
    <TreeProvider>
      <m.ul
        initial="hidden"
        animate="visible"
        variants={listVariant}
        style={{ maxHeight: '100%' }}
      >
        <TreeNode level={0} node={rootDirectory} />
      </m.ul>
    </TreeProvider>
  );
};
