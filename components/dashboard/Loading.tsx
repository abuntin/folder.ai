'use client';

import * as React from 'react';
import { LoadingComponent as Loading, useDashboard } from 'components';

interface LoadingComponentProps {}

export const LoadingComponent: React.FC<LoadingComponentProps> = props => {
  const [text, setText] = React.useState('Loading...');

  const { loading } = useDashboard();

  React.useEffect(() => {
    if (loading.state)
      setText(loading.text === '' ? 'Loading...' : loading.text);
  }, [loading]);

  return <Loading text={text} />;
};
