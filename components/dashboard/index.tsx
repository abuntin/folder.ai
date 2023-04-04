import { Kernel, Folder, rootFolder } from "lib/models";
import React from "react";

export * from "./DealList";
export * from "./Dashboard";

export const DashboardContext = React.createContext<{
  kernel: Kernel;
  current: Folder;
  root: Folder;
  loading: boolean;
  selected: Folder;
  view: "grid" | "tile";
}>(null);

export const useDashboard = () => {
  const context = React.useContext(DashboardContext);

  if (!context) throw new Error("Dashboard components only");

  return context;
};

export const DashboardProvider = ({ children, rootPath, ...rest }) => {
  const { current: kernel } = React.useRef(new Kernel());

  const [loading, setLoadingComponent] = React.useState(true);

  const [root, setRoot] = React.useState<Folder>(null);

  const [current, setCurrent] = React.useState<Folder>(null);

  const [selected, setSelected] = React.useState<Folder>(null);

  const [view, setView] = React.useState<"grid" | "tile">("grid");

  const load = React.useCallback(
    (path: string, isRoot = false) => {
      setLoadingComponent(true);

      if (isRoot) kernel.setRootPath(path);

      kernel
        .load(path)
        .then((folder) => {
          setCurrent(folder);

          if (isRoot) {
            setRoot(folder);
          }
        })
        .finally(() => setLoadingComponent(false));
    },
    [kernel]
  );

  // Load root path

  React.useEffect(() => {
    if (!rootPath) return;

    load(rootPath, true);
  }, [rootPath, kernel, load]);

  // Listen for change view event

  React.useEffect(() => {
    const changeViewEvent = kernel.on("view", setView);

    return () => {
      changeViewEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for select event

  React.useEffect(() => {
    const selectEvent = kernel.on("select", setSelected);

    return () => {
      selectEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for loading event

  React.useEffect(() => {
    const loadingEvent = kernel.on("loading", () => setLoadingComponent(true));

    const loadEvent = kernel.on("load", () => setLoadingComponent(false));

    return () => {
      loadingEvent.unsubscribe();
      loadEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for directory change event

  React.useEffect(() => {
    const event = kernel.on("directoryChange", setCurrent);

    return () => event.unsubscribe();
  }, [kernel]);

  return (
    <DashboardContext.Provider
      value={{ kernel, current, root, loading, selected, view }} // Provide filesystem properties as context
      {...rest}
    >
      {children}
    </DashboardContext.Provider>
  );
};
