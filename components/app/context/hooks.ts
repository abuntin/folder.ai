import { validateFiles } from 'lib/functions';
import { Kernel } from 'lib/models';
import * as React from 'react';
import { KernelContext, KernelApiContext } from './Context';

/**
 * Hook to access filesystem service and state from DashboardProvider children
 * @returns KernelContext
 */
export const useKernel = () => {
  const context = React.useContext(KernelContext);

  if (!context) throw new Error('Dashboard components only');

  return context;
};

/**
 * Hook to access filesystem service and state from DashboardProvider children
 * @returns KernelContext
 */
export const useKernelApi = () => {
  const context = React.useContext(KernelApiContext);

  if (!context) throw new Error('Dashboard components only');

  return context;
};

/**
 * Hook to handle file uploads by drag and drop / manual, exposes
 * @returns Event handlers handleAdd, handleDrag, handleDrop, State dragOver
 */
export const useUpload = () => {
  const [dragOver, setDragOver] = React.useState(false);

  const { kernel } = useKernel();

  // handle drag events
  const handleDrag = function (e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      kernel.trigger('select', null);
      setDragOver(true);
    } else if (e.type === 'dragleave') {
      setDragOver(false);
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
    e.nativeEvent.stopImmediatePropagation();

    setDragOver(false);

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
        directory: folder ?? kernel.currentDirectory.folder,
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
        directory: directory ?? kernel.currentDirectory.folder,
        files,
      });
    } else kernel.trigger('error', 'Missing files to upload');
  };

  return {
    dragOver,
    handleDrag,
    handleDrop,
    handleAdd,
  };
};
