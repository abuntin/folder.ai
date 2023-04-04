"use client";

import { GridViewSharp, ViewListSharp } from "@mui/icons-material";
import {
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import {
  AppearAnimationParent,
  LoadingComponent,
  DInput,
  AddButton,
  HoverAnimation,
} from "components";
import { margin, padding } from "lib/constants";
import { Folder } from "lib/models";
import * as React from "react";
import { useDashboard } from ".";
import { DashboardItemIcon } from "./DashboardItemIcon";
import { DashboardItemTile } from "./DashboardItemTile";

interface DashboardListProps {}

export const DashboardList: React.FC<DashboardListProps> = (props) => {
  const { current, view, kernel, selected, loading } = useDashboard();

  const folders = React.useMemo(() => {
    const folder = current;

    if (!folder || !folder.children.length) return [] as Folder[];

    return folder.children;
  }, [current]);

  const handleSelect = (e: any, folder: Folder) => {
    kernel.trigger("select", folder);
  };

  return loading ? (
    <LoadingComponent />
  ) : (
    <AppearAnimationParent>
      <Grid
        container
        spacing={4}
        display="flex"
        justifyContent="space-between"
        sx={{ pl: padding * 2, pr: padding * 2 }}
      >
        <Grid
          xs={12}
          container
          display="flex"
          alignItems="stretch"
          justifyContent="space-between"
        >
          <Grid xs={8} display="flex" alignItems="flex-start">
            <DInput placeholder="Search" />
          </Grid>
          <Grid xs={2}></Grid>
          <Grid
            container
            xs={2}
            display="flex"
            alignItems="flex-end"
            justifyContent="space-around"
          >
            <Grid xs={6} display="flex" justifyContent="center">
              <AddButton />
            </Grid>
            <Grid xs={6} display="flex" justifyContent="center">
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(e, newVal) => kernel.trigger("view", newVal)}
              >
                <ToggleButton value="grid">
                  <GridViewSharp
                    color={view === "grid" ? "info" : "disabled"}
                  />
                </ToggleButton>
                <ToggleButton value="tile">
                  <ViewListSharp
                    color={view === "grid" ? "disabled" : "info"}
                  />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} container spacing={view === "grid" ? 6 : 2}>
          {folders.map((folder: Folder, i) => {
            return (
              <Grid
                xs={view === "grid" ? 4 : 12}
                onDoubleClick={(e) => kernel.load(folder.path)}
                onClick={(e) => handleSelect(e, folder)}
              >
                {view === "grid" ? (
                  <DashboardItemIcon
                    folder={folder}
                    selected={selected && selected.id === folder.id}
                  />
                ) : (
                  <>
                    <HoverAnimation>
                      <DashboardItemTile
                        folder={folder}
                        selected={selected && selected.id === folder.id}
                      />
                    </HoverAnimation>
                    <Divider color="background.default" />
                  </>
                )}
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </AppearAnimationParent>
  );
};
