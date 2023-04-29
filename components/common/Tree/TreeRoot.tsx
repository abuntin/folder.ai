'use client';

import { listVariant } from 'components/animation';
import { useKernel } from 'components/app';
import { m } from 'framer-motion';
import * as React from 'react';
import { TreeProvider } from './context';
import { TreeNode } from './TreeNode';

interface TreeRootProps {}

export const TreeRoot: React.FC<TreeRootProps> = props => {
  let { kernel } = useKernel();

  let { currentDirectory } = kernel
  
  return  (
  <TreeProvider>
    <m.ul
      initial="hidden"
      animate="visible"
      variants={listVariant}
      style={{ maxHeight: '100%' }}
    >
      <TreeNode
        level={0}
        node={currentDirectory}
      />
    </m.ul>
  </TreeProvider>
  )
};
