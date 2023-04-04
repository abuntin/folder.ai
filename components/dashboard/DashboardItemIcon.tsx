"use client";

import { Box, BoxProps, useTheme } from "@mui/material";
import { FolderSharp, FolderOpenSharp, InsertDriveFileSharp } from "@mui/icons-material";
import { AppearAnimationChild } from "components/animation";
import { DText } from "components/common";
import { padding, borderRadius, margin } from "lib/constants";
import { Folder } from "lib/models";
import * as React from "react";

interface DashboardItemProps extends BoxProps {
  folder: Folder;
  selected: boolean;
}

export const DashboardItemIcon: React.FC<DashboardItemProps> = (props) => {
  const { folder, selected, ...rest } = props;

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
          borderRadius,
          "&:hover": { backgroundColor: "background.paper" },
        }}
        {...rest}
      >
        {folder.isDirectory ? (
          folder.children ?
          <FolderSharp
            color="primary"
            sx={{ mb: margin * 2, mt: margin * 2, fontSize: 60 }}
          />
          : 
          <FolderOpenSharp
            fontSize='large'
            color='disabled'
            sx={{ mb: margin * 2, mt: margin * 2, fontSize: 60 }}
          />
        ) : (
          <InsertDriveFileSharp
            color="disabled"
            sx={{ mb: margin * 2, mt: margin * 2, fontSize: 60 }}
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
