"use client";

import {
  KeyboardArrowLeftSharp,
  KeyboardArrowRightSharp,
} from "@mui/icons-material";
import { Button, ButtonProps } from "@mui/material";
import * as React from "react";

export const DButton: React.FC<{ direction?: 'forward' | 'back'} & ButtonProps> = (props) => {
  const { children, ...rest } = props;

  const { direction, variant = "outlined" } = rest;

  return (
    <Button
      startIcon={
        direction && direction === "back" ? (
          <KeyboardArrowLeftSharp fontSize="small" />
        ) : undefined
      }
      endIcon={
        direction && direction === "forward" ? (
          <KeyboardArrowRightSharp fontSize="small" />
        ) : undefined
      }
      variant={variant}
      {...rest}
    >
      {children}
    </Button>
  );
};
