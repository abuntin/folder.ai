import { validateFiles } from 'lib/functions';
import { Kernel, Folder } from 'lib/models';
import React from 'react';

export interface DashboardContextInterface {
  kernel: Kernel;
  loading: { state: boolean; text: string };
  uploading: { state: boolean; progress: string };
  selected: Folder;
  view: 'grid' | 'tile';
  useUpload: typeof useUpload;
}

/**
 * DashboardContext Object
 * @type React.Context<DashboardContextInterface>
 */

export const DashboardContext =
  React.createContext<DashboardContextInterface>(null);

/**
 * Hook to access filesystem service and state from DashboardProvider children
 * @returns DashboardContext
 */
export const useDashboard = () => {
  const context = React.useContext(DashboardContext);

  if (!context) throw new Error('Dashboard components only');

  return context;
};

export const useUpload = () => {
  const [dragOver, setDragOver] = React.useState(false);

  const [uploadPane, setUploadPane] = React.useState(false);

  const [uploadProgress, setUploadProgress] = React.useState('');

  // handle upload progress

  const onUploadProgress = progressEvent => {
    console.log(progressEvent)
    setUploadProgress(
      parseFloat(
        ((progressEvent.loaded / progressEvent.total) * 100).toString()
      ).toFixed(2)
    );
  };

  // handle add button click

  const toggleUploadPane = (e: React.SyntheticEvent, state = false) =>
    setUploadPane(state ?? uploadPane ? false : true);

  // handle drag events
  const handleDrag = function (e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
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
      kernel.trigger(
        'upload',
        {
          folder: folder ?? kernel.current,
          files: validFiles,
        },
        onUploadProgress
      );

      setUploadProgress('');
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
  const handleAdd = function (e: any, kernel: Kernel, folder = null) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      kernel.trigger('upload', {
        folder: folder ?? kernel.current,
        files: e.dataTransfer.files,
      });
    }
  };

  return {
    dragOver,
    handleDrag,
    handleDrop,
    handleAdd,
    uploadPane,
    toggleUploadPane,
    uploadProgress,
  };
};
