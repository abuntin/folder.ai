"use client";

import * as React from "react";
import { LoadingComponent, useDashboard } from "components";

interface DashboardLoadingComponentProps {}

export const DashboardLoadingComponent: React.FC<DashboardLoadingComponentProps> = (props) => {

  const [text, setText] = React.useState('Loading...')
  
  const { loading } = useDashboard()

  React.useEffect(() => {

    if (loading.state) setText(loading.text === '' ? 'Loading...' : loading.text)

  }, [loading])


  return (
    <LoadingComponent text={text} />
  )
};
