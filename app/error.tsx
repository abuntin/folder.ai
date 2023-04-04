"use client";

import { useEffect } from "react";
import { ConstructionSharp } from "@mui/icons-material";
import { margin } from "lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
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
      }}
    >
      <p>Oh no, something went wrong... maybe refresh?</p>
      <ConstructionSharp fontSize="large" sx={{ mt: margin * 10 }} />
    </div>
  );
}
