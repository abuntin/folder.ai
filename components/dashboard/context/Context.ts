import { validateFiles } from 'lib/functions';
import { Kernel, Folder } from 'lib/models';
import React from 'react';
import { useDashboardApi, useUpload } from './hooks';

export interface DashboardContextInterface {
  kernel: Kernel;
  loading: boolean;
  selected: Folder;
  view: 'grid' | 'tile';
  useDashboardApi: typeof useDashboardApi;
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

type FolderActionState =
  | 'expanded'
  | 'handleActionExpand'
  | 'destination'
  | 'setDestination'
  | 'recentAction'
  | 'setRecentAction';

export interface DashboardApiContextInterface {
  clipboard: Folder[];
  state: { [key in FolderActionState]: any };
  folderActions: {
    [key in FolderActionType]: (e: React.SyntheticEvent) => void;
  };
}

export const DashboardApiContext =
  React.createContext<DashboardApiContextInterface>(null);
/**
 * DashboardContext Object
 * @type React.Context<DashboardContextInterface>
 */

export const DashboardContext =
  React.createContext<DashboardContextInterface>(null);
