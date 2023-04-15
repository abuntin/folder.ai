import { Directory, Folder } from 'lib/models';
import { DashboardApiContext, useDashboard } from './Context';
import React from 'react';

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
  const { kernel } = useDashboard();

  const [isPending, startTransition] = React.useTransition();

  const [clipboard, setClipboard] = React.useState<Folder[]>([]);

  // Listen for select event

  React.useEffect(() => {
    const selectEvent = kernel.on('select', folder => {
      setClipboard([])
    })

    return () => selectEvent.unsubscribe()

  }, [kernel])

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
      (payload: {folders: Folder[], directory: Directory}) => {
        if (payload.folders && payload.directory) {
          kernel.copy({ folders: payload.folders, directory: payload.directory });
        } else
          kernel.trigger('error', 'Missing source or destination Folders');
          kernel.trigger('cut', [])
      }
    );

    return () => pasteEvent.unsubscribe();
  }, [kernel]);

  // Listen for move event

  React.useEffect(() => {
    const moveEvent = kernel.on(
      'move',
      (payload: {folders: Folder[], directory: Directory}) => {
        if (payload.folders && payload.directory) {
          kernel.move({ folders: payload.folders, directory: payload.directory });
        } else
          kernel.trigger('error', 'Missing source or destination Folders');
          kernel.trigger('cut', [])
      }
    );

    return () => moveEvent.unsubscribe();
  }, [kernel]);

  // Listen for delete event

  React.useEffect(() => {
    const deleteEvent = kernel.on('delete', (folders: Folder[]) => {
      if (folders) {
        kernel.delete(folders);
      } else
        kernel.trigger('error', 'Missing Folders to delete');
        kernel.trigger('cut', [])
      kernel.trigger('select', null);
    });


    return () => deleteEvent.unsubscribe();
  }, [kernel]);

  // Listen for create event

  React.useEffect(() => {
    const createEvent = kernel.on('create', kernel.create)

    return () => createEvent.unsubscribe()
    
  }, [kernel])

  return (
    <DashboardApiContext.Provider
      value={{
        clipboard,
      }} // Provide filesystem API functions as context
      {...rest}
    >
      {children}
    </DashboardApiContext.Provider>
  );
};
