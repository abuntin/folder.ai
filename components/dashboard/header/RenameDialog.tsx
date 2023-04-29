'use client';

import * as React from 'react';
import { FormDialog, FormDialogProps } from 'components/common';
import { useKernel } from 'components/app';

interface RenameDialogProps extends FormDialogProps {}

export const RenameDialog: React.FC<RenameDialogProps> = props => {
  const { kernel, useKernelApi } = useKernel();

  const { folderActions } = useKernelApi();

  const { handleRename } = folderActions;

  const defaultProps = {
    value: '',
    title: 'Rename Folder',
    titleVariant: 'body1',
    onConfirm: handleRename,
    error: (value: string) => {
      let isError =
        kernel.currentDirectoriesExcl.filter(({ folder }) => folder.name == value)
          .length !== 0;
      return isError ? 'Directory already exists' : '';
    },
    inputLabel: 'New Directory Name',
    textfield: true,
  } as FormDialogProps;

  return (
    <FormDialog
      {...defaultProps}
      open={props.open}
      handleClose={props.handleClose}
    />
  );
};
