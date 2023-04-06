import { Folder, Kernel } from "lib/models";
import { DashboardContext } from "./DashboardContext";
import React from "react";
import { Snackbar, Alert } from "@mui/material";

/**
 * Wrapper component defining DashboardContext and managing UI state updates
 * @param React Component default props
 * @method load: Memoised React function that loads a Folder through the Kernel and performs UI state updates
 * @member loading: PropType<DashboardContext, 'loading'>
 * @member selected: PropType<DashboardContext, 'selected'>
 * @member view: PropType<DashboardContext, 'view'>
 * @member error: Controls the Snackbar error for user feedback
 * @returns DashboardProvider Component
 */

export const DashboardProvider = ({ children, ...rest }) => {
  const { current: kernel } = React.useRef(new Kernel());

  // const abortController = React.useRef<AbortController>();

  const [isPending, startTransition] = React.useTransition();

  const [loading, setLoadingState] = React.useState({ state: true, text: "" });

  const [selected, setSelected] = React.useState<Folder>(null);

  const [view, setView] = React.useState<"grid" | "tile">("grid");

  const [error, setError] = React.useState("");

  const setErrorMessage = (m: string) => startTransition(() => setError(m));

  const setLoading = (state: boolean, text = "") =>
    startTransition(() => setLoadingState({ state, text }));

  // React.useEffect(() => {
  //   // If there is a pending fetch request with associated AbortController, abort
  //   if (abortController.current) {
  //     abortController.current.abort();
  //   }
  //   // Assign a new AbortController for the latest fetch to our useRef variable
  //   abortController.current = new AbortController();
  // }, [abortController, loading]);

  const load = React.useCallback(
    (srcFolder: Folder, isRoot = false) => {
      setLoading(true);

      if (isRoot) kernel.currentDirectory = srcFolder;

      kernel
        .load(srcFolder)
        .then(
          ({ folders, directories }) =>
            (kernel.currentFolders = folders.concat(directories))
        )
        .catch((e) => setError(e.message))
        .finally(() => startTransition(() => setLoading(false)));
    },
    [kernel]
  );

  // Load root path

  React.useEffect(() => {
    kernel
      .getRootFolder()
      .then((rootFolder) => load(rootFolder, true))
      .catch((e) => setErrorMessage(e.message));
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
    const loadingEvent = kernel.on("loading", (text) =>
      setLoading(true, text ?? "")
    );

    return () => {
      loadingEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for load event

  React.useEffect(() => {
    const loadEvent = kernel.on("load", (srcFolder: Folder) => load(srcFolder));

    return () => {
      loadEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for idle event

  React.useEffect(() => {
    const idleEvent = kernel.on("idle", (text) =>
      setLoading(false, text ?? "")
    );

    return () => {
      idleEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for directory change event

  React.useEffect(() => {
    const event = kernel.on("directoryChange", () => {});

    return () => event.unsubscribe();
  }, [kernel]);

  // Clear error

  React.useEffect(() => {
    if (error !== null) setTimeout(() => setErrorMessage(""), 7000);
  }, [error]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
  };

  return (
    <DashboardContext.Provider
      value={{ kernel, loading, selected, view }} // Provide filesystem service (kernel) & UI properties as context
      {...rest}
    >
      <Snackbar
        open={error !== ""}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      {children}
    </DashboardContext.Provider>
  );
};

export * from "./DealList";
export * from "./Dashboard";
export * from "./DashboardContext";
