import { Folder, Kernel, rootFolder } from "lib/models";

import React from "react";
import { DashboardProvider, useDashboard } from ".";
import { DashboardFileList } from "./DashboardFileList";

interface FileManagerProps {
  /**
   * Root path to open in the file manager
   *
   * @default "/"
   */
  rootPath?: string;
  /**
   * Callback for when a file/directory is selected
   */
  onSelect?: (folder: Folder) => void;
  /**
   * Callback for when a file/directory is double clicked
   */
  onDoubleClick?: (folder: Folder) => void;
  /**
   * Callback for when a file/directory is right clicked
   */
  onRightClick?: (folder: Folder) => void;
  /**
   * Callback for when a file/directory is copied
   */
  onCopy?: (folder: Folder) => void;
  /**
   * Callback for when a file/directory is cut
   */
  onCut?: (folder: Folder) => void;
  /**
   * Callback for when a file/directory is pasted
   * The old folder will contain the old path and the new folder will contain the new path
   */
  onPaste?: (folder: Folder, oldFolder: Folder) => void;
  /**
   * Callback for when a file/directory is deleted
   */
  onDelete?: (folder: Folder) => void;
  /**
   * Callback for when a file/directory is renamed
   * The old folder will contain the old path/name and the new folder will contain the new path/name
   */
  onRename?: (folder: Folder, oldFolder: Folder) => void;
  /**
   * Callback for when a directory is created
   */
  onCreateDirectory?: (directory: Folder) => void;
  /**
   * Callback for when file(s) is uploaded
   */
  onUpload?: (files: Folder[]) => void;
  /**
   * Callback for when a file is downloaded
   */
  onDownload?: (folder: Folder) => void;
}

export const Dashboard: React.FC<FileManagerProps> = (props) => {
  // React.useEffect(() => {
  //   kernel.on("directoryChange", (newCurrentDirectory: Folder) => {
  //     if (newCurrentDirectory.path !== folder.path && isActiveFolder) {
  //       // setIsActiveFolder(false);
  //     } else if (newCurrentDirectory.path === folder.path && !isActiveFolder) {
  //       // setIsActiveFolder(true);
  //     }
  //   });
  // return () => event.unsubscribe();
  // }, [kernel, isActiveFolder, folder.path]);

  return (
    <DashboardProvider rootPath={rootFolder.path}>
      <DashboardFileList />
    </DashboardProvider>
  );
};
