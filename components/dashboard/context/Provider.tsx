import { Folder, Kernel } from 'lib/models';
import { DashboardContext } from './Context';
import { useDashboardApi, useUpload } from './hooks';
import React from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';
import { borderRadius } from 'lib/constants';
import { DashboardApiProvider } from './ApiProvider';
import { ProgressBar } from '../ProgressBar';
import { AxiosProgressEvent } from 'axios';

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

  const controller = new AbortController();

  const [isPending, startTransition] = React.useTransition();

  const [loading, setLoadingState] = React.useState(true);

  const [selected, setSelected] = React.useState<Folder>(null);

  const [view, setView] = React.useState<'grid' | 'tile'>('grid');

  const [error, setError] = React.useState('');

  const [success, setSuccess] = React.useState('');

  const [warning, setWarning] = React.useState('');

  const [uploadProgress, setUploadProgress] = React.useState<number | null>(
    null
  );

  const setWarningMessage = (m: string) => startTransition(() => setWarning(m));

  const setErrorMessage = (m: string) => startTransition(() => setError(m));

  const setSuccessMessage = (m: string) => startTransition(() => setSuccess(m));

  const setLoading = (state: boolean) =>
    startTransition(() => setLoadingState(state));

  const setSelectedFolder = (folder: Folder) =>
    startTransition(() => setSelected(folder));

  // Load root path

  React.useEffect(() => {
    try {
      kernel.init().then(() => kernel.load(kernel.rootDirectory));
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
      setWarningMessage('');
      setUploadProgress(null);
      setSuccessMessage('');
    });

    return () => {
      errorEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for loading event

  React.useEffect(() => {
    const loadingEvent = kernel.on('loading', (text: string) =>
      setLoading(true)
    );

    return () => {
      loadingEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for load event

  React.useEffect(() => {
    const loadEvent = kernel.on('load', directory => {
      kernel.load(directory);
      setSelectedFolder(null);
    });

    return () => {
      loadEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for warning event

  React.useEffect(() => {
    const warningEvent = kernel.on('warning', warning => {
      setWarningMessage(warning ?? '');
      setSuccessMessage('');
    });

    return () => {
      warningEvent.unsubscribe();
    };
  }, [error]);

  // Listen for idle event

  React.useEffect(() => {
    const idleEvent = kernel.on('idle', success => {
      setLoading(false);
      setUploadProgress(null);
      setErrorMessage('');
      setWarningMessage('');
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
    const uploadEvent = kernel.on('upload', payload => {
      if (payload.directory && payload.files) {
        kernel.upload(payload, (event: AxiosProgressEvent) => {
          if (event.total) {
            setUploadProgress(Math.round((event.loaded * 100) / event.total));
          } else setUploadProgress(null);
        });
      }
    });

    return () => uploadEvent.unsubscribe();
  }, [kernel]);

  // Listen for refresh event

  React.useEffect(() => {
    const refreshEvent = kernel.on('refresh', kernel.refresh);

    return () => refreshEvent.unsubscribe();
  });

  // Clear warning

  React.useEffect(() => {
    if (warning && !uploadProgress && warning !== '')
      setTimeout(() => setErrorMessage(''), 6000);
  }, [warning]);

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
        useDashboardApi,
        useUpload,
      }} // Provide filesystem service (kernel) & UI properties as context
      {...rest}
    >
      <Snackbar
        open={error !== '' || warning !== '' || success !== ''}
        //autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={
            error !== '' ? 'error' : warning !== '' ? 'warning' : 'success'
          }
          sx={{ width: '100%', borderRadius }}
        >
          <Stack>
            {error !== '' ? error : warning !== '' ? warning : success}
            {uploadProgress && (
              <ProgressBar progress={uploadProgress} barWidth={300} />
            )}
          </Stack>
        </Alert>
      </Snackbar>
      <DashboardApiProvider>{children}</DashboardApiProvider>
    </DashboardContext.Provider>
  );
};
