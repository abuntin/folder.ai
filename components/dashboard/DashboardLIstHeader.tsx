"use client";

import { GridViewSharp, ViewListSharp } from "@mui/icons-material";
import { Unstable_Grid2 as Grid, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { DInput, AddButton } from "components/common";
import * as React from "react";
import { useDashboard } from "./DashboardContext";

interface DashboardListHeaderProps {}

export const DashboardListHeader: React.FC<DashboardListHeaderProps> = (
  props
) => {
  const { kernel, view } = useDashboard();

  return (
    <Grid
      xs={12}
      container
      display="flex"
      alignItems="stretch"
      justifyContent="space-between"
    >
      <Grid xs={6} display="flex" alignItems="flex-start">
        <DInput placeholder="Search" color="primary" />
      </Grid>
      <Grid
        container
        xs={4}
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Grid xs={6} display="flex" justifyContent="center">
          <AddButton />
        </Grid>
        <Grid xs={6} display="flex" justifyContent="start">
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newVal) => kernel.trigger("view", newVal)}
          >
            <ToggleButton value="grid" size="small">
              <GridViewSharp color={view === "grid" ? "info" : "disabled"} />
            </ToggleButton>
            <ToggleButton value="tile" size="small">
              <ViewListSharp color={view === "grid" ? "disabled" : "info"} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
};
