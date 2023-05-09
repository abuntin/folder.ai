'use client';

import { IconButton, IconButtonProps, Box } from '@mui/material';
import Tippy from '@tippyjs/react';
import { AnimatePresence, m } from 'framer-motion';
import * as React from 'react';
import { DBox, DText } from '.';
import { borderRadius } from 'lib/constants'

interface TippedIconButtonProps extends IconButtonProps {
  tooltip?: string;
  tooltipColor?: string;
  width?: number;
  height?: number;
}

export const Tooltip: React.FC<TippedIconButtonProps> = ({ width, height, tooltipColor, tooltip }) => (
  <AnimatePresence>
      <Box
        sx={{
          width: width ?? 80,
          height: height ?? 30,
          backgroundColor: tooltipColor ?? 'info.main',
          borderRadius
        }}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <DText text={tooltip ?? ''} />
      </Box>
    </AnimatePresence>
)

export const TippedIconButton: React.FC<TippedIconButtonProps> = props => {
  const { tooltip, tooltipColor, children, width, height, ...rest } = props;

  return (
    <Tippy content={Tooltip({ tooltip, tooltipColor, width, height })}>
      <IconButton {...rest}>{children}</IconButton>
    </Tippy>
  );
};
