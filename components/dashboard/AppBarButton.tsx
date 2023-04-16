'use client';

import * as React from 'react';
import Image from 'next/image';
import logo from 'public/logo_button.png';
import { m } from 'framer-motion';
import { useDashboard } from './Context';

interface AppBarButtonProps {}

export const AppBarButton: React.FC<AppBarButtonProps> = props => {
  const { kernel } = useDashboard();

  return (
    <m.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: '0%' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      exit={{ x: '-100%' }}
      transition={{
        x: {
          duration: 0.1,
          ease: [0, 0.71, 0.2, 1.01],
          damping: 10,
          stiffness: 100,
          restDelta: 0.001,
        },
        opacity: {
          duration: 0.1
        },
      }}
      //onClick={e => kernel.trigger('appbar', 'max')}
      // style={{ position: 'fixed', bottom: 2, left: '41.5%' }}
    >
      <Image
        alt="Folder.AI Appbar Button"
        src={logo}
        width={100}
        height={100}
      />
    </m.div>
  );
};
