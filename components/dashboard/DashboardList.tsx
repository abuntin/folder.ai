"use client";

import { FolderSharp, InsertDriveFileSharp } from "@mui/icons-material";
import { Box, BoxProps, Unstable_Grid2 as Grid, useTheme } from "@mui/material";
import {
  AppearAnimationChild, AppearAnimationParent, DText, Loading
} from "components";
import { margin, padding } from "lib/constants";
import { Folder } from "lib/models";
import * as React from "react";
import { useDashboard } from ".";

interface DashboardListProps {}

export const DashboardList: React.FC<DashboardListProps> = (props) => {
  const { current, root, kernel, selected, loading } = useDashboard();

  const folders = React.useMemo(() => {
    const folder = current;

    if (!folder || !folder.children.length) return [] as Folder[];

    return folder.children;
  }, [current]);

  const handleSelect = (e: any, folder: Folder) => {
    kernel.trigger("select", folder);
  };

  return loading ? (
    <Loading />
  ) : (
    <AppearAnimationParent>
      <Grid
        container
        spacing={6}
        display="flex"
        justifyContent="space-between"
        sx={{ padding: padding * 2 }}
      >
        {folders.map((folder: Folder, i) => {
          return (
            <Grid
              xs={4}
              onDoubleClick={(e) => kernel.load(folder.path)}
              onClick={(e) => handleSelect(e, folder)}
            >
              <DashboardItem
                folder={folder}
                selected={selected && selected.id === folder.id}
              />
            </Grid>
          );
        })}
      </Grid>
    </AppearAnimationParent>
  );
};

interface DashboardItemProps extends BoxProps {
  folder: Folder;
  selected: boolean;
}

const DashboardItem: React.FC<DashboardItemProps> = ({
  folder,
  selected,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <AppearAnimationChild>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          padding: padding,
          backgroundColor: selected ? "background.paper" : undefined,
          "&:hover": { backgroundColor: "background.paper" },
        }}
        {...rest}
      >
        {folder.isDirectory ? (
          <FolderSharp
            fontSize="large"
            color="disabled"
            sx={{ mb: margin * 2, mt: margin * 2 }}
          />
        ) : (
          <InsertDriveFileSharp
            fontSize="large"
            color="disabled"
            sx={{ mb: margin * 2, mt: margin * 2 }}
          />
        )}
        <DText
          text={folder.name}
          variant="subtitle2"
          color={theme.palette.common.white}
          fontWeight="regular"
        />
      </Box>
    </AppearAnimationChild>
  );
};
