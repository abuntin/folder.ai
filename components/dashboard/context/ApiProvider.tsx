import { Directory, Folder } from 'lib/models';
import { DashboardApiContext } from './Context';
import React from 'react';
import { useDashboard } from './hooks';

/**
 * Wrapper component defining DashboardContext and managing UI state updates
 * @param React Component default props
 * @listens KernelEvent
 * @property loading: PropType<DashboardContext, 'loading'>
 * @property selected: PropType<DashboardContext, 'selected'>
 * @property view: PropType<DashboardContext, 'view'>
 * @property error: Controls the Snackbar error for user feedback
 * @returns DashboardProvider: React.Component
 */

export const DashboardApiProvider = ({ children, ...rest }) => {
  const { kernel, selected } = useDashboard();

  const [isPending, startTransition] = React.useTransition();

  const [clipboard, setClipboardState] = React.useState<Folder[]>([]);

  const [expanded, setExpandedState] = React.useState(false);

  const [recentAction, setRecentAction] = React.useState<
    'rename' | 'move' | 'copy' | 'delete' | null
  >(null);

  const [destination, setDestination] = React.useState<Directory>(null);

  const setClipboard = (folders: Folder[]) =>
    startTransition(() => setClipboardState(folders));

  const setExpanded = (state: boolean) =>
    startTransition(() => setExpandedState(state));

  // Listen for select event

  React.useEffect(() => {
    const selectEvent = kernel.on('select', folder => {
      setClipboard([]);
    });

    return () => selectEvent.unsubscribe();
  }, [kernel]);

  // Listen for copy and cut events

  React.useEffect(() => {
    const copyEvent = kernel.on('copy', setClipboard);

    const cutEvent = kernel.on('cut', setClipboard);

    return () => {
      copyEvent.unsubscribe();
      cutEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for paste event

  React.useEffect(() => {
    const pasteEvent = kernel.on(
      'paste',
      (payload: { folders: Folder[]; directory: Directory }) => {
        if (payload.folders && payload.directory) {
          kernel.copy({
            folders: payload.folders,
            directory: payload.directory,
          });
        } else kernel.trigger('error', 'Missing source or destination Folders');
        kernel.trigger('cut', []);
      }
    );

    return () => pasteEvent.unsubscribe();
  }, [kernel]);

  // Listen for move event

  React.useEffect(() => {
    const moveEvent = kernel.on(
      'move',
      (payload: { folders: Folder[]; directory: Directory }) => {
        if (payload.folders && payload.directory) {
          kernel.move({
            folders: payload.folders,
            directory: payload.directory,
          });
        } else {
          kernel.trigger('error', 'Missing source or destination Folders');
        }
        kernel.trigger('cut', []);
        kernel.trigger('select', null);
      }
    );

    return () => moveEvent.unsubscribe();
  }, [kernel]);

  // Listen for delete event

  React.useEffect(() => {
    const deleteEvent = kernel.on('delete', (folders: Folder[]) => {
      if (folders) {
        kernel.delete(folders);
      } else kernel.trigger('error', 'Missing Folders to delete');
      kernel.trigger('cut', []);
      kernel.trigger('select', null);
    });

    return () => deleteEvent.unsubscribe();
  }, [kernel]);

  // Listen for create event

  React.useEffect(() => {
    const createEvent = kernel.on('create', kernel.create);

    return () => createEvent.unsubscribe();
  }, [kernel]);

  const handleActionExpand = (e: React.SyntheticEvent) => {
    if (expanded) setRecentAction(null);
    setExpanded(expanded ? false : true);
  };

  const handleCut = (e: React.SyntheticEvent) => {
    setRecentAction('move');
    kernel.trigger('cut', [selected]);
  };

  const handlePaste = (e: React.SyntheticEvent) => {
    kernel.trigger('paste', {
      folders: clipboard,
      directory: destination,
    });
  };

  const handleMove = (e: React.SyntheticEvent) => {
    kernel.trigger('move', {
      folders: clipboard,
      directory: destination,
    });
  };

  const handleRename = (e: React.SyntheticEvent) => {
    if (!selected) {
      kernel.trigger('error', 'Select a Folder to rename');
      return;
    }

    kernel.trigger('rename', {
      name: '',
      folder: selected,
      directory: kernel.current,
    });
  };

  const handleDelete = (e: React.SyntheticEvent) => {
    if (!selected) {
      kernel.trigger('error', 'Select a Folder to delete');
      return;
    }

    kernel.trigger('delete', [selected]);
  };

  const handleClear = (e: React.SyntheticEvent) => {
    kernel.trigger('cut', []);
    setRecentAction(null);
  };

  const handleCopy = (e: React.SyntheticEvent) => {
    setRecentAction('copy');
    kernel.trigger('copy', [selected]);
  };

  const folderActions = {
    handleCut,
    handleCopy,
    handleClear,
    handleDelete,
    handleMove,
    handlePaste,
    handleRename,
    
  };

  const state = {
    expanded,
    recentAction,
    setRecentAction,
    setDestination,
    handleActionExpand,
    destination,
  };

  return (
    <DashboardApiContext.Provider
      value={{
        clipboard,
        folderActions,
        state
      }} // Provide filesystem API functions as context
      {...rest}
    >
      {children}
    </DashboardApiContext.Provider>
  );
};
