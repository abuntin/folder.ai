"use client";

import * as React from "react";
import { Folder } from "lib/models";
import { GridViewSharp, ViewListSharp } from "@mui/icons-material";
import {
  Unstable_Grid2 as Grid,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { borderRadius, margin, padding } from "lib/constants";
import { AppearAnimationParent, HoverAnimation } from "components/animation";
import { DInput, AddButton } from "components/common";
import { useScroll } from "framer-motion";
import { useDashboard } from "components";
import dynamic from "next/dynamic";

interface DashboardListContentProps {}

export const DashboardListContent: React.FC<DashboardListContentProps> = (
  props
) => {
  const { scrollYProgress } = useScroll();

  const { view, kernel, selected } = useDashboard();

  const handleSelect = (e: any, folder: Folder) => {
    kernel.trigger("select", folder);
  };

  const handleNavigate = (e: any, folder: Folder) => {
    if (folder.isDirectory) kernel.trigger('load', folder)
  };

  const FolderComponent = React.useMemo(
    () =>
      view === "tile"
        ? dynamic(() =>
            import("./DashboardItemTile").then((_) => _.DashboardItemTile)
          )
        : dynamic(() =>
            import("./DashboardItemIcon").then((_) => _.DashboardItemIcon)
          ),
    [view, selected, kernel.folders]
  );

  console.log(kernel.folders)

  return (
    <AppearAnimationParent>
      <Grid
        container
        spacing={4}
        display="flex"
        justifyContent="space-between"
        sx={{
          pl: padding * 2,
          pr: padding * 2,
          borderRadius,
          bgColor: (theme) => theme.palette.common.white,
        }}
      >
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
        <Grid
          xs={12}
          container
          spacing={view === "grid" ? 6 : 2}
          sx={{
            mt: margin * 2,
            mb: margin * 2,
            borderRadius,
            backgroundColor: 'background.default',
            padding,
          }}
        >
          <Grid xs={12}>
            {
              kernel.currentDirectory
            }
          </Grid>
          {kernel.folders.map((folder: Folder, i) => {
            return (
              <Grid
                key={i}
                xs={view === "grid" ? 4 : 12}
                onDoubleClick={(e) => handleNavigate(e, folder)}
                onClick={(e) => handleSelect(e, folder)}
              >
                <HoverAnimation>
                  <FolderComponent
                    selected={selected && selected.id === folder.id}
                    folder={folder}
                  />
                </HoverAnimation>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </AppearAnimationParent>
  );
};
