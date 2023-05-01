'use client';

import { Box, Stack } from '@mui/material';
import { DText, FolderSelect } from 'components/common';
import { borderRadius, margin, padding, borderWidth } from 'lib/constants';
import * as React from 'react';
import { useKernel } from 'components/app';
import AddFolder from 'public/info/AddFolder.svg';
import { NavAnimation } from 'components/animation';
import Image from 'next/image';
import { Folder } from 'lib/models';

interface UploadFolderDialogProps {
  handleClose: any;
}

export const UploadFolderDialog: React.FC<UploadFolderDialogProps> = props => {
  const { useUpload, kernel } = useKernel();

  const { dragOver, handleDrag, handleDrop, handleAdd } = useUpload();

  const [destination, setDestination] = React.useState<Folder>(null);

  const hiddenFileInput = React.useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!destination) kernel.trigger('error', 'Select Destination Directory');
    props.handleClose(e);
    handleAdd(e, kernel, destination);
  };

  const handleUpload = (e: React.SyntheticEvent) =>
    hiddenFileInput.current.click();

  return (
    <Stack>
      <Stack direction="row" sx={{ mb: margin * 3 }}>
        <NavAnimation
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Image
            alt="FolderAI Folder Diagram"
            src={AddFolder}
            width={51}
            height={30}
          />
        </NavAnimation>
        <DText
          text="FolderAI uses Folders to organise your data. Each Folder contains your File as well as FolderAI's thoughts ;)"
          variant="h6"
        />
      </Stack>
      <Stack spacing={2} sx={{ mt: margin, mb: margin * 2 }}>
        <DText text="Select Upload Directory" variant="subtitle1" />
        <FolderSelect
          onChange={(e, value, reason) => {
            if (reason == 'clear') setDestination(null);
            else if (reason == 'selectOption') setDestination(value.folder);
          }}
        />
      </Stack>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          borderStyle: 'dashed',
          borderRadius: borderRadius * 2,
          backgroundColor: dragOver ? 'background.paper' : 'background.default',
          padding: padding * 4,
          borderWidth,
        }}
        onDrop={e => handleDrop(e, kernel, destination)}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onClick={handleUpload}
      >
        <input
          multiple
          ref={hiddenFileInput}
          type="file"
          style={{ display: 'none' }}
          onChange={handleChange}
        />

        <DText
          text={
            dragOver
              ? 'Drop it here!'
              : 'This is a Drag and Drop. Click to be boring'
          }
          variant="h5"
          color={dragOver ? 'success' : 'disabled'}
        />
      </Box>
    </Stack>
  );
};
