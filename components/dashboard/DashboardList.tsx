"use client";

import {
  Box,
} from "@mui/material";
import dynamic from "next/dynamic";
import * as React from "react";
import { useDashboard } from ".";
import { padding } from 'lib/constants'

interface DashboardListProps {}

export const DashboardList: React.FC<DashboardListProps> = (props) => {

  const { loading, kernel, current } = useDashboard()

  const Component = React.useMemo(() => (
    current && !loading ? dynamic(() => import('./DashboardListContent').then(_ => _.DashboardListContent))
    : dynamic(() => import('components/common').then(_ => _.LoadingComponent))
  ), [loading, kernel])

  return <Box sx={{ paddingLeft: padding * 2, paddingRight: padding * 2 }}> <Component /> </Box>
};
