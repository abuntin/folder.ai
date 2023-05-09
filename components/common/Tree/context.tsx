import { useKernel } from 'components/app';
import { m } from 'framer-motion';
import { TreeNode } from 'lib/models';
import { PropType } from 'lib/types';
import * as React from 'react';
import { DText } from '../DText';
import { TreeRootSkeleton } from './TreeRoot';
import { BlinkAnimation } from 'components/animation';

interface TreeContextInterface {
  open: { [k: string]: boolean };
  handleClick: (e: React.SyntheticEvent, node: TreeNode) => void;
  handleOpen: (e: React.SyntheticEvent, node: TreeNode) => void;
  active: PropType<TreeNode, 'key'>;
}

export const TreeContext = React.createContext<TreeContextInterface>({
  open: {},
  handleClick: null,
  handleOpen: null,
  active: null,
});

export const useKernelTree = () => {
  const context = React.useContext(TreeContext);

  if (!context) throw new Error('Tree components only');

  return context;
};

export const TreeProvider = ({ children }) => {
  let { kernel, loading } = useKernel();

  let { directoriesExcl, currentDirectory, currentFolders } = kernel;

  let [isPending, startTransition] = React.useTransition();

  let [open, setOpenState] = React.useState(
    directoriesExcl.length
      ? directoriesExcl.reduce(
          (prev, curr, i) => ({
            ...prev,
            [curr.key]: false,
          }),
          {}
        )
      : {}
  );

  let [active, setActiveState] = React.useState<TreeContextInterface['active']>(
    currentDirectory ? currentDirectory.key : null
  );

  const setOpen = (state: boolean, key: string) => {
    startTransition(() => setOpenState({ ...open, [key]: state }));
  };

  const setActive = (key: string) => {
    startTransition(() => setActiveState(key));
  };

  const handleOpen = (e: React.SyntheticEvent, node: TreeNode) => {
    let { folder } = node;
    if (loading.tree) return;
    if (open[folder.path]) setOpen(false, folder.path);
    else {
      kernel.trigger('load', folder.path, 'tree');
      setOpen(true, folder.path);
    }
  };

  const handleClick = (e: React.SyntheticEvent, node: TreeNode) => {
    node.hasChildren && setActive(node.key);
  };

  return (
    <TreeContext.Provider value={{ open, active, handleClick, handleOpen }}>
      {currentDirectory && currentFolders.length ? (
        children
      ) : loading.tree ? (
        <BlinkAnimation>
          <TreeRootSkeleton />
        </BlinkAnimation>
      ) : (
        <DText text="Nothing to see here yet!" />
      )}
    </TreeContext.Provider>
  );
};
