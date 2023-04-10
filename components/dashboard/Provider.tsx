import { Folder, Kernel } from 'lib/models';
import { DashboardContext, useUpload } from './Context';
import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { borderRadius } from 'lib/constants'

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

export const DashboardProvider = ({ children, ...rest }) => {
  const { current: kernel } = React.useRef(new Kernel());

  const [isPending, startTransition] = React.useTransition();

  const [loading, setLoadingState] = React.useState({ state: true, text: '' });

  const [selected, setSelected] = React.useState<Folder>(null);

  const [parentDragOver, setParentDragOver] = React.useState(false)

  const [view, setView] = React.useState<'grid' | 'tile'>('grid');

  const [error, setError] = React.useState('');

  const [success, setSuccess] = React.useState('');

  const [warning, setWarning] = React.useState('');

  const setWarningMessage = (m: string) => startTransition(() => setWarning(m));

  const setErrorMessage = (m: string) => startTransition(() => setError(m));

  const setSuccessMessage = (m: string) => startTransition(() => setSuccess(m));

  const setLoading = (state: boolean, text = '') =>
    startTransition(() => setLoadingState({ state, text }));

  const setSelectedFolder = (folder: Folder) =>
    startTransition(() => setSelected(folder));

  // Load root path

  React.useEffect(() => {
    try {
      kernel.init().then(() => kernel.load(kernel.rootFolder));
    } catch (e) {
      setErrorMessage(e.message);
    }
  }, []);

  // Listen for change view event

  React.useEffect(() => {
    const changeViewEvent = kernel.on('view', setView);

    return () => {
      changeViewEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for select event

  React.useEffect(() => {
    const selectEvent = kernel.on('select', setSelectedFolder);

    return () => {
      selectEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for error event

  React.useEffect(() => {
    const errorEvent = kernel.on('error', message => {
      setLoading(false);
      setErrorMessage(message ?? '');
    });

    return () => {
      errorEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for loading event

  React.useEffect(() => {
    const loadingEvent = kernel.on('loading', (text: string) =>
      setLoading(true, text ?? '')
    );

    return () => {
      loadingEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for load event

  React.useEffect(() => {
    const loadEvent = kernel.on('load', kernel.load);

    return () => {
      loadEvent.unsubscribe();
    };
  }, [kernel]);

   // Listen for warning event

   React.useEffect(() => {
    const warningEvent = kernel.on('warning', warning => {
      setWarningMessage(warning ?? '');
    });

    return () => {
      warningEvent.unsubscribe();
    };
  }, [error]);


  // Listen for idle event

  React.useEffect(() => {
    const idleEvent = kernel.on('idle', success => {
      setLoading(false);
      setErrorMessage('')
      setWarningMessage('')
      setSuccessMessage(success ?? '');
    });

    return () => {
      idleEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for directory change event TODO: Implement Dir Change Event Listener

  React.useEffect(() => {
    const dirEvent = kernel.on('directoryChange', () => {});

    return () => dirEvent.unsubscribe();
  }, [kernel]);

  // Listen for upload event

  React.useEffect(() => {
    const uploadEvent = kernel.on('upload', kernel.upload);

    return () => uploadEvent.unsubscribe();
  }, [kernel]);

  // Listen for refresh event

  React.useEffect(() => {
    const refreshEvent = kernel.on('refresh', kernel.refresh);

    return () => refreshEvent.unsubscribe();
  });

  // Clear warning

  React.useEffect(() => {
    if (error && error !== '') setTimeout(() => setErrorMessage(''), 6000);
  }, [error]);

  // Clear error

  React.useEffect(() => {
    if (error && error !== '') setTimeout(() => setErrorMessage(''), 6000);
  }, [error]);

  // Clear success

  React.useEffect(() => {
    if (success && success !== '')
      setTimeout(() => setSuccessMessage(''), 6000);
  }, [success]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      setErrorMessage('');
      return;
    }
    setErrorMessage('');
  };

  return (
    <DashboardContext.Provider
      value={{
        kernel,
        loading,
        selected,
        view,
        useUpload,
        uploading: { state: false, progress: '0' },
        parentDragOver: { state: parentDragOver, setParentDragOver } 
      }} // Provide filesystem service (kernel) & UI properties as context
      {...rest}
    >
      <Snackbar
        open={(error !== '' || warning !== '' || success !== '')}
        //autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={ error !== '' ? "error" : warning !== '' ? 'warning' : 'success'} sx={{ width: '100%', borderRadius }}>
          {error !== '' ? error: warning !== '' ? warning : success}
        </Alert>
      </Snackbar>
      {children}
    </DashboardContext.Provider>
  );
};
