'use client';

import * as React from 'react';
import { LoadingComponent as Loading } from 'components/common';
import { useKernel } from 'components/app'

interface LoadingComponentProps {}

export const LoadingComponent: React.FC<LoadingComponentProps> = props => {
  const [text, setText] = React.useState('Loading...');

  const { loading } = useKernel();

  React.useEffect(() => {
    if (loading.folders) setText('Loading...');
  }, [loading]);

  return <Loading text={text} />;
};
