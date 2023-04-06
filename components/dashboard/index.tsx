import { Kernel, Folder } from "lib/models";
import React from "react";
import { Snackbar, Alert } from '@mui/material'

export const DashboardContext = React.createContext<{
  kernel: Kernel;
  current: Folder[];
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

export const DashboardProvider = ({ children, ...rest }) => {
  const { current: kernel } = React.useRef(new Kernel());

  const [isPending, startTransition] = React.useTransition()

  const [loading, setLoading] = React.useState(true);

  const [root, setRoot] = React.useState<Folder>(null);

  const [current, setCurrent] = React.useState<Folder[]>([]);

  const [selected, setSelected] = React.useState<Folder>(null);

  const [view, setView] = React.useState<"grid" | "tile">("grid");

  const [error, setError] = React.useState('')

  const setErrorMessage = (m: string) => startTransition(() => setError(m))

  const load = React.useCallback(
    (srcFolder: Folder, isRoot = false) => {
      setLoading(true);

      if (isRoot) setRoot(srcFolder)

      kernel
        .load(srcFolder)
        .then((folders) => setCurrent(folders))
        .catch(e => setError(e.message))
        .finally(() => startTransition(() => setLoading(false)));
    },
    [kernel]
  );

  // Load root path

  React.useEffect(() => {
    kernel.getRootFolder().then(rootFolder => load(rootFolder, true)).catch(e => setErrorMessage(e.message))
  }, []);

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
    const loadingEvent = kernel.on("loading", () => setLoading(true));

    const loadEvent = kernel.on("load", () => startTransition(() => setLoading(false)));

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

  // Clear error

  React.useEffect(() => {
    if (error !== null) setTimeout(() => setErrorMessage(''), 7000)
  }, [error])

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
  };

  return (
    <DashboardContext.Provider
      value={{ kernel, current, root, loading, selected, view }} // Provide filesystem properties as context
      {...rest}
    >
      <Snackbar open={error !== ''} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      {children}
    </DashboardContext.Provider>
  );
};


export * from "./DealList";
export * from "./Dashboard";