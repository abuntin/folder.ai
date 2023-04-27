'use client';

import { listVariant } from 'components/animation';
import { m } from 'framer-motion';
import { Folder, TreeNode as Node } from 'lib/models';
import * as React from 'react';
import { TreeNode } from './TreeNode';

interface TreeProps {
  nodes: Node[];
  level: number;
}

export const Tree: React.FC<TreeProps> = props => {
  let { nodes, level } = props;

  let initialState = nodes.reduce(
    (prev, curr, i) => (curr.folder.isDirectory ? {
      ...prev,
      [curr.key]: false,
    } : prev),
    {}
  );

  let [open, setOpen] = React.useState(initialState);

  React.useEffect(() => {

  }, [open]);

  const handleClick = (e: React.SyntheticEvent, folder: Folder) => {
    setOpen({ ...open, [folder.path]: true})
  };

  return (
    <m.ul variants={listVariant}>
      {nodes.map((node, i) => (
        <TreeNode
          level={level + 1}
          node={node}
          key={i}
          isActive={false}
          open={node.folder.isDirectory ? open[node.folder.path] : false}
          handleClick={e => (node.folder.isDirectory ? handleClick(e, node.folder) : {})}
        />
      ))}
    </m.ul>
  );
};
