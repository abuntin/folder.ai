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
}

export const TippedIconButton: React.FC<TippedIconButtonProps> = props => {
  const { tooltip, tooltipColor, children, ...rest } = props;

  const Tooltip = () => (
    <AnimatePresence>
      <Box
        sx={{
          width: 80,
          height: 30,
          backgroundColor: tooltipColor ?? 'secondary.main',
          borderRadius
        }}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <DText text={tooltip} />
      </Box>
    </AnimatePresence>
  );
  return (
    <Tippy content={Tooltip()}>
      <IconButton {...rest}>{children}</IconButton>
    </Tippy>
  );
};
