'use client';

import * as React from 'react';
import { BlinkAnimation } from '../animation';
import Image from 'next/image';
import logo from 'public/logo_transparent.svg';

interface LoadingComponentProps {
  text?: string;
  height?: number;
  width?: number;
}

export const LoadingComponent: React.FC<LoadingComponentProps> = ({
  text,
  height,
  width,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        justifySelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <BlinkAnimation>
        <Image
          alt="FolderAI Loading"
          src={logo}
          width={width ?? 250}
          height={height ?? 250}
        />
      </BlinkAnimation>
      {/* <DText
          text={text ?? 'Loading...'}
          fontWeight="medium"
          fontSize={24}
          textAlign="center"
          color={(theme) => theme.palette.common.white}
          sx={{ opacity: 0.5 }}
        /> */}
    </div>
  );
};
