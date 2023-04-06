"use client";

import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import * as React from "react";
import { useDashboard } from ".";
import { padding } from "lib/constants";

interface DashboardListProps {}

export const DashboardList: React.FC<DashboardListProps> = (props) => {
  const { loading, kernel } = useDashboard();

  const { folders } = kernel;

  const Component = React.useMemo(() => {
    console.log("Component changed, loading...");
    if (folders && !loading.state)
      return dynamic(() =>
        import("./DashboardListContent").then((_) => _.DashboardListContent)
      );
    else
      return dynamic(() =>
        import("./DashboardLoading").then((_) => _.DashboardLoadingComponent)
      );
  }, [loading, folders]);

  return (
    <Box sx={{ paddingLeft: padding * 2, paddingRight: padding * 2 }}>
      <Component />
    </Box>
  );
};
