'use client';

import { useKernel } from 'components/app';
import { Folder } from 'lib/models';
import * as React from 'react';
import { DText } from './DText';
import { TreeNode } from './TreeNode';

interface TreeRootProps {}

export const TreeRoot: React.FC<TreeRootProps> = props => {
  let { kernel, loading } = useKernel();

  let { foldersExcl, directoriesExcl, currentDirectory, folders } = kernel;

  let [open, setOpen] = React.useState(
    folders
      ? directoriesExcl.reduce(
          (prev, curr, i) => ({
            ...prev,
            [curr.key]: false,
          }),
          {}
        )
      : {}
  );

  const handleClick = (e: React.SyntheticEvent, folder: Folder) => {
    if (loading) return;
    kernel.trigger('load', folder.path)
    setOpen({ ...open, [folder.path]: true });
  };

  return folders && folders.length ? (
    <ul>
      {folders.map((node, i) => (
        <TreeNode
          level={0}
          node={node}
          key={i}
          open={node.folder.isDirectory ? open[node.key] : false}
          handleClick={e => (node.folder.isDirectory ? handleClick(e, node.folder) : {})}
          isActive={false}
        />
      ))}
    </ul>
  ) : (
    <DText text="Here" />
  );
};
