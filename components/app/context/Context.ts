import { Kernel, Folder } from 'lib/models';
import React from 'react';
import { useKernelApi, useUpload } from './hooks';

export type LoadingType = 'folders' | 'tree'

export interface AppContextInterface {
  kernel: Kernel;
  loading: { [k in LoadingType]: boolean};
  selected: Folder;
  view: 'grid' | 'tile';
  useKernelApi: typeof useKernelApi;
  useUpload: typeof useUpload;
}

type FolderActionType =
  | 'handleCut'
  | 'handleCopy'
  | 'handleClear'
  | 'handleDelete'
  | 'handleMove'
  | 'handlePaste'
  | 'handleRename';

export interface KernelApiContextInterface {
  clipboard: Folder[];
  folderActions: {
    [key in FolderActionType]: (
      e: React.SyntheticEvent,
      ...args: any[]
    ) => void;
  };
}

export const KernelApiContext =
  React.createContext<KernelApiContextInterface>(null);
/**
 * KernelContext Object
 * @type React.Context<AppContextInterface>
 */

export const KernelContext = React.createContext<AppContextInterface>(null);
