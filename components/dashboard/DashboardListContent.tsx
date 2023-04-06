"use client";

import {
  KeyboardArrowLeft
} from "@mui/icons-material";
import { IconButton, Unstable_Grid2 as Grid } from "@mui/material";
import { useDashboard } from "components";
import { HoverAnimation } from "components/animation";
import { DText } from "components/common";
import { borderRadius, margin, padding } from "lib/constants";
import { Folder } from "lib/models";
import dynamic from "next/dynamic";
import * as React from "react";

interface DashboardListContentProps {}

export const DashboardListContent: React.FC<DashboardListContentProps> = (
  props
) => {
  const { view, kernel, selected } = useDashboard();

  const handleSelect = (e: any, folder: Folder) => {
    kernel.trigger("select", folder);
  };

  const handleNavigate = (e: any, folder: Folder) => {
    if (folder.isDirectory) kernel.trigger("load", folder);
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

  return (
    <Grid
      xs={12}
      container
      spacing={view === "grid" ? 6 : 2}
      sx={{
        mt: margin * 2,
        mb: margin * 2,
        borderRadius,
        backgroundColor: "background.default",
        padding,
      }}
    >
      <Grid
        xs={12}
        container
        display="flex"
        justifyContent="space-around"
        alignItems="flex-start"
      >
        <Grid xs={6}>
          {!kernel.isRoot && (
            <IconButton onClick={(e) => kernel.goBack()} color="secondary">
              <KeyboardArrowLeft fontSize="medium" />
            </IconButton>
          )}
        </Grid>
        <Grid xs={6}>
          <DText text={kernel.current.name} />
        </Grid>
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
  );
};
