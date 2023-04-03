import { Kernel, Folder, rootFolder } from "lib/models";
import React from "react";

export * from "./DashboardList";
export * from './Dashboard'

export const DashboardContext = React.createContext<{
  kernel: Kernel;
  current: Folder;
  root: Folder;
  loading: boolean;
}>(null);

export const useDashboard = () => {
  const context = React.useContext(DashboardContext);

  if (!context) throw new Error("Dashboard components only");

  return context;
};

export const DashboardProvider = ({ children, rootPath, ...rest }) => {

  const { current: kernel } = React.useRef(new Kernel());

  const [loading, setLoading] = React.useState(true);

  const [root, setRoot] = React.useState<Folder>(null);

  const [current, setCurrent] = React.useState<Folder>(null);

  const load = React.useCallback(
    (path: string, isRoot = false) => {
      setLoading(true);

      if (isRoot) kernel.setRootPath(path);

      kernel
        .load(path)
        .then((folder) => {
          setCurrent(folder);

          if (isRoot) {
            setRoot(folder);
          }
        })
        .finally(() => setLoading(false));
    },
    [kernel]
  );

  // Load root path

  React.useEffect(() => {
    if (!rootPath) return;

    load(rootPath, true);
  }, [rootPath, kernel, load]);


  // Listen for loading event

  React.useEffect(() => {

    const loadingEvent = kernel.on("loading", () => setLoading(true));

    const loadEvent = kernel.on("load", () => setLoading(false));

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
      value={{ kernel, current, root, loading }} // Provide filesystem properties as context
      {...rest}
    >
      {children}
    </DashboardContext.Provider>
  );
};
