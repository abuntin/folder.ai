"use client";

import { useAppSelector } from "lib/redux";
import * as React from "react";
import { Box, Unstable_Grid2 as Grid, useTheme } from "@mui/material";
import dynamic from "next/dynamic";

interface EditorViewProps {
  file?: string;
}

export const EditorView: React.FC<EditorViewProps> = (props) => {
  const { file } = props;

  const theme = useTheme();

  const viewer = React.useRef(null);

  return (
    <Grid container>
        <Grid xs={12}>
            <Box ref={viewer} sx={{ height: "80%" }} />
        </Grid>
    </Grid>
    
  );
};
