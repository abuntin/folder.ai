import { Kernel, Folder } from "lib/models";
import React from "react";

export interface DashboardContextInterface {
  kernel: Kernel;
  loading: { state: boolean; text: string };
  selected: Folder;
  view: "grid" | "tile";
}

/**
 * DashboardContext Object
 * @type React.Context<DashboardContextInterface>
 */

export const DashboardContext =
  React.createContext<DashboardContextInterface>(null);

/**
 * Hook to access filesystem service and state from DashboardProvider children
 * @returns DashboardContext
 */
export const useDashboard = () => {
  const context = React.useContext(DashboardContext);

  if (!context) throw new Error("Dashboard components only");

  return context;
};
