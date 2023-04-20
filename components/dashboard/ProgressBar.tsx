'use client';

import { Box, BoxProps } from '@mui/system';
import { m } from 'framer-motion';
import { padding, borderRadius } from 'lib/constants';
import * as React from 'react';

interface ProgressBarProps extends BoxProps {
  progress: number;
  barWidth: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = props => {
  const { progress, color, barWidth } = props;

  const percentsOffset = (progress - 100) * (barWidth / 100);

  const transition = {
    duration: 3,
    delay: 0.5,
    ease: 'easeInOut',
  };

  const variants = {
    animate: {
      // opacity: 1,
      x: [-barWidth, percentsOffset],
      transition,
    },
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <m.div
        variants={variants}
        initial="enter"
        animate="animate"
        exit="enter"
        style={{
          backgroundColor: color ?? 'green',
          width: '100%',
          height: padding,
          borderRadius
        }}
      ></m.div>
    </Box>
  );
};
