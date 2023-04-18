import { validateFiles } from 'lib/functions';
import { Kernel } from 'lib/models';
import * as React from 'react';
import { DashboardContext, DashboardApiContext } from './Context';

/**
 * Hook to access filesystem service and state from DashboardProvider children
 * @returns DashboardContext
 */
export const useDashboard = () => {
  const context = React.useContext(DashboardContext);

  if (!context) throw new Error('Dashboard components only');

  return context;
};

/**
 * Hook to access filesystem service and state from DashboardProvider children
 * @returns DashboardContext
 */
export const useDashboardApi = () => {
  const context = React.useContext(DashboardApiContext);

  if (!context) throw new Error('Dashboard components only');

  return context;
};

/**
 * Hook to handle file uploads by drag and drop / manual, exposes
 * @returns Event handlers handleAdd, handleDrag, handleDrop, State dragOver
 */
export const useUpload = () => {
  const [parentDragOver, setParentDragOver] = React.useState(false);
  const [childDragOver, setChildDragOver] = React.useState(false);
  const [dialogDragOver, setDialogDragOver] = React.useState(false);
  const [isDialog, setIsDialog] = React.useState(false)

  const { kernel } = useDashboard();

  // handle drag events
  const handleDrag = function (
    e: React.SyntheticEvent,
    component: 'dialog' | 'container' | 'child'
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      kernel.trigger('select', null);
      switch (component) {
        case 'child':
          setParentDragOver(false);
          setDialogDragOver(false);
          setChildDragOver(true);
          break;
        case 'container':
          setDialogDragOver(false);
          setChildDragOver(false);
          setParentDragOver(true);
          break;
        case 'dialog':
          setChildDragOver(false);
          setParentDragOver(false);
          setDialogDragOver(true);
          break;
      }
    } else if (e.type === 'dragleave') {
      switch (component) {
        case 'container':
          setParentDragOver(false);
          break;
        case 'dialog':
          setDialogDragOver(false);
          break;
        case 'child':
          setChildDragOver(false);
          break;
      }
    }
  };

  // triggers when file is dropped
  const handleDrop = function (
    e: React.DragEvent<HTMLDivElement>,
    kernel: Kernel,
    folder = null
  ) {
    e.preventDefault();
    e.stopPropagation();

    setParentDragOver(false);
    setDialogDragOver(false);
    setChildDragOver(false);

    if (!e.dataTransfer.files) {
      kernel.trigger('error', 'Error adding files to folder');
      return;
    }

    if (e.dataTransfer.files.length === 0) {
      kernel.trigger('error', 'No files detected, plesae try again');
      return;
    }

    let files = Array.from(e.dataTransfer.files);

    let { validFiles, invalidFiles } = validateFiles(files);

    if (validFiles.length > 0) {
      kernel.trigger('upload', {
        directory: folder ?? kernel.current,
        files: validFiles,
      });
    } else {
      let str = '';
      for (let i = 0; i < invalidFiles.length; i++) {
        let file = invalidFiles[i];
        str += `${file.name}${i === invalidFiles.length - 1 ? ',' : ''} `;
      }

      str += `${invalidFiles.length === 1 ? 'is' : 'are'} of invalid file type`;

      kernel.trigger('error', str);
    }
  };

  // triggers when file is selected with click
  const handleAdd = function (e: any, kernel: Kernel, directory = null) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      let fileList = e.target.files as FileList;

      let files = [] as File[];

      for (let i = 0; i < fileList.length; i++) files.push(fileList[i]);

      kernel.trigger('upload', {
        directory: directory ?? kernel.current,
        files,
      });
    } else kernel.trigger('error', 'Missing files to upload');
  };

  return {
    parentDragOver,
    childDragOver,
    dialogDragOver,
    handleDrag,
    handleDrop,
    handleAdd,
    isDialog,
    setIsDialog
  };
};
