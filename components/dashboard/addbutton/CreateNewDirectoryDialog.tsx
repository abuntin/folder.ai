'use client';

import * as React from 'react';
import CreateNewDirectory from 'public/info/CreateNewDirectory.svg';
import Image from 'next/image';
import { NavAnimation } from 'components/animation';
import { DText } from 'components/common';
import { Stack } from '@mui/material';
import { margin } from 'lib/constants';

interface CreateNewDirectoryDialogProps {}

export const CreateNewDirectoryDialog: React.FC<
  CreateNewDirectoryDialogProps
> = props => {
  return (
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
          alt="FolderAI Directory Diagram"
          src={CreateNewDirectory}
          width={86}
          height={50}
        />
      </NavAnimation>
      <DText
        text="FolderAI uses Directories to organise your Folders. Once created and indexed, you can perform full text and semantic search, chat to valid* documents, and more!"
        variant="h6"
      />
    </Stack>
  );
};
