"use client";

import { GridViewSharp, ViewListSharp } from "@mui/icons-material";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Unstable_Grid2 as Grid,
  useTheme
} from "@mui/material";
import {
  AddButton, AppearAnimationParent, bgLight, DInput, HoverAnimation, LoadingComponent
} from "components";
import { motion, useScroll } from 'framer-motion'
import { borderRadius, margin, padding } from "lib/constants";
import { Folder } from "lib/models";
import * as React from "react";
import { useDashboard } from ".";
import { DashboardItemIcon } from "./DashboardItemIcon";
import { DashboardItemTile } from "./DashboardItemTile";

interface DashboardListProps {}

export const DashboardList: React.FC<DashboardListProps> = (props) => {

  const { scrollYProgress } = useScroll();

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
    <Box sx={{ maxHeight: '100%', overflowY: 'scroll', borderRadius }}>
      <motion.div
        style={{ scaleX: scrollYProgress, background: bgLight, height: margin * 5, borderRadius }}
      />
      <AppearAnimationParent>
      <Grid
        container
        spacing={4}
        display="flex"
        justifyContent="space-between"
        sx={{ pl: padding * 2, pr: padding * 2, pt: padding * 2 }}
      >
        <Grid
          xs={12}
          container
          display="flex"
          alignItems="stretch"
          justifyContent="space-between"
        >
          <Grid xs={6} display="flex" alignItems="flex-start">
            <DInput placeholder="Search" variant="standard" />
          </Grid>
          <Grid
            container
            xs={4}
            display="flex"
            alignItems="flex-end"
            justifyContent="space-around"
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
                    <DashboardItemIcon
                      folder={folder}
                      selected={selected && selected.id === folder.id}
                    />
                ) : (
                    <HoverAnimation>
                      <DashboardItemTile
                        folder={folder}
                        selected={selected && selected.id === folder.id}
                      />
                    </HoverAnimation>
                )}
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </AppearAnimationParent>
    </Box>
  );
};
