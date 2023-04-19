'use client';

import { Box, Stack } from '@mui/material';
import { DText } from 'components/common';
import { borderRadius, margin, padding, borderWidth } from 'lib/constants';
import * as React from 'react';
import { useDashboard } from '../context';
import AddFolder from 'public/info/AddFolder.svg';
import { NavAnimation } from 'components/animation';
import Image from 'next/image'

interface UploadFolderDialogProps {}

export const UploadFolderDialog: React.FC<UploadFolderDialogProps> = props => {
  const { useUpload, kernel } = useDashboard();

  const { dialogDragOver, handleDrag, handleDrop, handleAdd, setIsDialog } = useUpload();

  const hiddenFileInput = React.useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAdd(e, kernel);
  };

  const handleUpload = (e: React.SyntheticEvent) =>
    hiddenFileInput.current.click();


    React.useEffect(() => {

        setIsDialog(true)

        return () => {
            setIsDialog(false)
        }

    }, [])

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
            alt="Folder.AI Folder Diagram"
            src={AddFolder}
            width={51}
            height={30}
          />
        </NavAnimation>
        <DText
          text="Folder.AI uses Folders to organise your data. Each Folder contains your File as well as Folder.AI's thoughts ;)"
          variant="h6"
        />
      </Stack>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          borderStyle: 'dashed',
          borderRadius: borderRadius * 2,
          backgroundColor: dialogDragOver ? 'background.paper' : 'background.default',
          padding: padding * 4,
          borderWidth
        }}
        // onDrop={e => handleDrop(e, kernel, kernel.current)}
        // onDragEnter={e => handleDrag(e, 'dialog')}
        // onDragOver={e => handleDrag(e, 'dialog')}
        // onDragLeave={e => handleDrag(e, 'dialog')}
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
          text={dialogDragOver ? 'Drop it here!' : "This should be a Drag and Drop. Click for now"}
          variant="h5"
          color={dialogDragOver ? 'success' : "disabled"}
        />
      </Box>
    </Stack>
  );
};
