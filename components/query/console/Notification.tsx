'use client';

import { Box, BoxProps, Stack } from '@mui/system';
import { DText } from 'components/common';
import { borderRadius, padding } from 'lib/constants';
import * as React from 'react';

export interface ConsoleNotificationProps extends BoxProps {
  severity: 'success' | 'error' | 'warning' | 'info';
  text: string;
}

export const ConsoleNotification: React.FC<ConsoleNotificationProps> = ({
  severity,
  text,
  ...rest
}) => {
  return (
    <Stack direction="row" sx={{ display: 'flex', alignItems: 'center' }} spacing={1}> 
      <Box
        sx={{
          backgroundColor: `${severity}.main`,
          borderRadius,
          paddingLeft: padding,
          paddingBottom: padding
        }}
      />
      <DText text={text} variant="body2" />
    </Stack>
  );
};
