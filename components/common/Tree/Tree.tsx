'use client';

import { listVariant } from 'components/animation';
import { m } from 'framer-motion';
import { TreeNode as Node } from 'lib/models';
import * as React from 'react';
import { TreeNode, TreeNodeSkeleton } from './TreeNode';

interface TreeProps {
  nodes: Node[];
  level: number;
}

export const TreeSkeleton: React.FC<Omit<TreeProps, 'nodes'>> = ({ level }) => (
  <m.ul
    initial="hidden"
    animate="visible"
    variants={listVariant}
    style={{ overflow: 'auto', maxHeight: 300 }}
  >
    {Array(Math.floor(Math.random() * 2) + 2).fill(0).map((val, i) => (
      <TreeNodeSkeleton level={level + 1} key={i} />
    ))}
  </m.ul>
);

export const Tree: React.FC<TreeProps> = props => {
  let { nodes, level } = props;

  return (
    <m.ul
      initial="hidden"
      animate="visible"
      variants={listVariant}
      style={{ overflow: 'auto', maxHeight: 300 }}
    >
      {nodes.map((node, i) => (
        <TreeNode level={level + 1} node={node} key={i} />
      ))}
    </m.ul>
  );
};
