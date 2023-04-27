import { Directory, Folder } from 'lib/models';
import { KernelApiContext } from './Context';
import React from 'react';
import { useKernel } from './hooks';

/**
 * Wrapper component defining KernelContext and managing UI state updates
 * @param React Component default props
 * @listens KernelEvent
 * @property loading: PropType<KernelContext, 'loading'>
 * @property selected: PropType<KernelContext, 'selected'>
 * @property view: PropType<KernelContext, 'view'>
 * @property error: Controls the Snackbar error for user feedback
 * @returns DashboardProvider: React.Component
 */

export const KernelApiProvider = ({ children, ...rest }) => {
  const { kernel, selected } = useKernel();

  const [isPending, startTransition] = React.useTransition();

  const [clipboard, setClipboardState] = React.useState<Folder[]>([]);

  const [expanded, setExpandedState] = React.useState(false);

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

  const handleCut = (e: React.SyntheticEvent) => {
    kernel.trigger('cut', [selected]);
  };

  const handlePaste = (e: React.SyntheticEvent, destination: Directory) => {
    kernel.trigger('paste', {
      folders: clipboard,
      directory: destination,
    });
  };

  const handleMove = (e: React.SyntheticEvent, destination: Directory) => {
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
      directory: kernel.currentDirectory,
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
  };

  const handleCopy = (e: React.SyntheticEvent) => {
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

  return (
    <KernelApiContext.Provider
      value={{
        clipboard,
        folderActions,
      }} // Provide filesystem API functions as context
      {...rest}
    >
      {children}
    </KernelApiContext.Provider>
  );
};
