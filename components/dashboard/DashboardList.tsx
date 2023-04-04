"use client";

import { GridViewSharp, ViewListSharp } from "@mui/icons-material";
import {
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Unstable_Grid2 as Grid,
  useTheme
} from "@mui/material";
import {
  AddButton, AppearAnimationParent, DInput, HoverAnimation, LoadingComponent
} from "components";
import { motion } from "framer-motion";
import { padding } from "lib/constants";
import { Folder } from "lib/models";
import * as React from "react";
import { useDashboard } from ".";
import { DashboardItemIcon } from "./DashboardItemIcon";
import { DashboardItemTile } from "./DashboardItemTile";

interface DashboardListProps {}

export const DashboardList: React.FC<DashboardListProps> = (props) => {
  const theme = useTheme();

  const { current, view, kernel, selected, loading } = useDashboard();

  const folders = React.useMemo(() => {
    const folder = current;

    if (!folder || !folder.children.length) return [] as Folder[];

    return folder.children;
  }, [current]);

  const handleSelect = (e: any, folder: Folder) => {
    kernel.trigger("select", folder);
  };

  const handleNavigate = (e: any, folder: Folder) => {
    if (folder.isDirectory && folder.children) kernel.load(folder.path);
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
          <Grid xs={6} display="flex" alignItems="flex-start">
            <DInput placeholder="Search" noTheme={true} variant="standard" />
          </Grid>
          <Grid
            container
            xs={4}
            display="flex"
            alignItems="flex-end"
            justifyContent="space-around"
          >
            <Grid xs={6} display="flex" alignItems="center">
              <AddButton />
            </Grid>
            <Grid xs={6} display="flex" alignItems="center">
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(e, newVal) => kernel.trigger("view", newVal)}
              >
                <ToggleButton value="grid" size="small">
                  <GridViewSharp
                    color={view === "grid" ? "info" : "disabled"}
                  />
                </ToggleButton>
                <ToggleButton value="tile" size="small">
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
                key={i}
                xs={view === "grid" ? 4 : 12}
                onDoubleClick={(e) => handleNavigate(e, folder)}
                onClick={(e) => handleSelect(e, folder)}
              >
                {view === "grid" ? (
                  <motion.div layout>
                    <DashboardItemIcon
                      folder={folder}
                      selected={selected && selected.id === folder.id}
                    />
                  </motion.div>
                ) : (
                  <>
                    <HoverAnimation>
                      <DashboardItemTile
                        folder={folder}
                        selected={selected && selected.id === folder.id}
                      />
                    </HoverAnimation>
                    <Divider color={theme.palette.common.white} />
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
