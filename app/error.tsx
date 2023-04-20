"use client";

import { useEffect } from "react";
import { ConstructionSharp } from "@mui/icons-material";
import { margin } from "lib/constants";
import { useTheme } from "@mui/material";
import Image from 'next/image'
import ErrorImg from 'public/info/Error.svg'

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const theme = useTheme()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.secondary.light
      }}
    >
      <Image src={ErrorImg} alt="Folder.AI" width={400} height={400} />
      <ConstructionSharp fontSize="large" sx={{ mt: margin * 10 }} />
    </div>
  );
}
