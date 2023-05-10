'use client';

import {
  FolderOpenSharp,
  FolderSharp,
  SnippetFolderSharp,
} from '@mui/icons-material';
import { Stack, useTheme } from '@mui/material';
import { BlinkAnimation, itemVariant, listVariant } from 'components/animation';
import { useKernel } from 'components/app';
import { m } from 'framer-motion';
import { margin, padding, borderRadius } from 'lib/constants';
import { TreeNode as Node } from 'lib/models';
import * as React from 'react';
import { DText } from '../DText';
import { ExpandMoreButton } from '../ExpandMoreButton';
import { LoadingComponent } from '../Loading';
import { useKernelTree } from './context';
import { Tree, TreeSkeleton } from './Tree';

interface TreeNodeProps {
  node: Node;
  level: number;
}

export const TreeNodeSkeleton: React.FC<
  Omit<TreeNodeProps, 'node'> & { range: number }
> = ({ level, range }) => {
  return (
    <m.li
      variants={itemVariant}
      style={{ marginBottom: margin * 2, cursor: 'pointer' }}
    >
      <div style={{ padding: padding * 3, borderRadius: borderRadius * 2 }}>
        <Stack
          spacing={1}
          direction="row"
          sx={{ ml: level * margin, display: 'flex', alignItems: 'center' }}
        >
          <div>
            <FolderSharp color="primary" sx={{ fontSize: 18 }} />
          </div>
        </Stack>
      </div>
      {range != 0 && (
        <m.ul
          initial="hidden"
          animate="visible"
          style={{
            paddingLeft: margin,
            marginTop: margin * 2,
            overflow: 'auto',
            maxHeight: 300,
          }}
          variants={listVariant}
        >
          <TreeSkeleton level={level + 1} range={range - 1} />
        </m.ul>
      )}
    </m.li>
  );
};

export const TreeNode: React.FC<TreeNodeProps> = props => {
  const theme = useTheme();
  let {
    loading,
    kernel: { rootDirectory },
  } = useKernel();

  let { handleClick, handleOpen, open, active } = useKernelTree();

  const { node, level } = props;

  let { isDirectory, name } = node.folder;

  let children = Object.values(node.directories);

  let [nodeLoading, setNodeLoading] = React.useState(false);

  React.useEffect(() => {
    if (!rootDirectory) setNodeLoading(false);
    else if (rootDirectory && !loading.tree && nodeLoading)
      setNodeLoading(false);
  }, [loading.tree]);

  const getItemIcon = isDirectory ? (
    children.length ? (
      <FolderSharp
        color={active == node.key ? 'info' : 'primary'}
        sx={{ fontSize: 18 }}
      />
    ) : (
      <FolderOpenSharp color="primary" sx={{ fontSize: 18 }} />
    )
  ) : (
    <SnippetFolderSharp
      color={active == node.key ? 'info' : 'primary'}
      sx={{ fontSize: 18 }}
    />
  );

  return nodeLoading ? (
    <m.li
      variants={itemVariant}
      style={{ marginBottom: margin * 2, cursor: 'pointer' }}
      whileHover={{ backgroundColor: theme.palette.background.paper }}
    >
      <BlinkAnimation style={{ flexGrow: 1, flexShrink: 1, flexBasis: 'auto' }}>
        <Stack
          spacing={1}
          direction="row"
          sx={{ ml: level * margin, display: 'flex', alignItems: 'center' }}
        >
          <FolderOpenSharp color="primary" sx={{ fontSize: 18 }} />
          <DText text={name} variant="body2" />
          <ExpandMoreButton
            color="primary"
            sx={{ width: 24, height: 24, ml: margin * 2 }}
            expanded={true}
            deg={90}
            disabled={true}
          />
        </Stack>
      </BlinkAnimation>
    </m.li>
  ) : (
    <m.li
      variants={itemVariant}
      style={{ marginBottom: margin * 2, cursor: 'pointer' }}
    >
      <m.div
        style={{ padding: padding * 3, borderRadius: borderRadius * 2 }}
        whileHover={{ backgroundColor: theme.palette.background.paper }}
      >
        <Stack
          spacing={1}
          direction="row"
          sx={{ ml: level * margin, display: 'flex', alignItems: 'center' }}
        >
          <m.div
            whileHover={{ scale: 1.1 }}
            onClick={e => handleClick(e, node)}
          >
            {getItemIcon}
          </m.div>

          <DText text={name} variant="body2" />
          {isDirectory && (
            <ExpandMoreButton
              color="primary"
              sx={{ width: 24, height: 24, ml: margin * 2 }}
              expanded={open[node.key]}
              onClick={e => {
                setNodeLoading(true);
                handleOpen(e, node);
              }}
              deg={90}
            />
          )}
        </Stack>
      </m.div>
      <m.ul
        initial="hidden"
        animate="visible"
        style={{
          paddingLeft: margin,
          marginTop: margin * 2,
          overflow: 'auto',
          maxHeight: 300,
        }}
        variants={listVariant}
      >
        {open[node.key] ? (
          children.length ? (
            <Tree nodes={children} level={level + 1} />
          ) : loading.tree ? (
            <LoadingComponent height={50} width={50} />
          ) : (
            <DText
              text="Nothing to see here"
              variant="body2"
              sx={{ ml: (level + 1) * margin }}
            />
          )
        ) : null}
      </m.ul>
    </m.li>
  );
};
