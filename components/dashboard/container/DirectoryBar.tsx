'use client';

import { useTheme, Box } from '@mui/material';
import { SnippetFolderSharp, FolderSharp } from '@mui/icons-material';
import { DText } from 'components/common';
import { m } from 'framer-motion';
import { borderRadius, padding, margin } from 'lib/constants';
import * as React from 'react';
import { useKernel } from 'components/app';
import { BlinkAnimation } from 'components/animation';

interface DirectoryBarProps {}

export const DirectoryBar: React.FC<DirectoryBarProps> = props => {
  const theme = useTheme();

  const {
    kernel: { currentDirectory, currentDirectoriesExcl, currentFoldersExcl },
  } = useKernel();

  return (
    <m.div
      initial="false"
      animate="enter"
      transition={{ ease: 'easeInOut' }}
      aria-label="Current Directory"
      whileHover={{ scale: 1.05 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.info.main,
        borderRadius: borderRadius * 3,
        paddingLeft: padding * 10,
        paddingRight: padding * 10,
        paddingTop: padding * 5,
        paddingBottom: padding * 5,
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {!currentDirectory && (
          <BlinkAnimation>
            <DText
              text='Opening...'
              variant="h6"
              fontWeight="medium"
            />
          </BlinkAnimation>
        )}

        {currentDirectory && (
          <DText
            text={currentDirectory.folder.name}
            variant="h6"
            fontWeight="medium"
          />
        )}

        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          ml={margin * 4}
        >
          {currentDirectory && currentFoldersExcl && (
            <DText
              text={currentFoldersExcl.length}
              variant="h6"
              fontWeight="medium"
            />
          )}
          <SnippetFolderSharp color="primary" sx={{ fontSize: 18 }} />
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" ml={margin}>
        {currentDirectory && currentDirectoriesExcl && (
          <DText
            text={currentDirectoriesExcl.length}
            variant="h6"
            fontWeight="medium"
          />
        )}
        <FolderSharp color="primary" sx={{ fontSize: 18 }} />
      </Box>
    </m.div>
  );
};
