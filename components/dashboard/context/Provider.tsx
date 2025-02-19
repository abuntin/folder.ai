import { Folder, Kernel } from 'lib/models';
import { DashboardContext } from './Context';
import { useDashboardApi, useUpload } from './hooks';
import React from 'react';
import { Snackbar, Alert, Stack, AlertProps } from '@mui/material';
import { borderRadius } from 'lib/constants';
import { DashboardApiProvider } from './ApiProvider';
import { ProgressBar } from '../ProgressBar';
import { AxiosProgressEvent } from 'axios';
import { LoadingComponent } from 'components/common';

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

  const [snackbarLoading, setSnackbarLoadingState] = React.useState(false);

  const [selected, setSelected] = React.useState<Folder>(null);

  const [view, setView] = React.useState<'grid' | 'tile'>('grid');

  const [error, setError] = React.useState('');

  const [success, setSuccess] = React.useState('');

  const [warning, setWarning] = React.useState('');

  const [info, setInfo] = React.useState('');

  const [uploadProgress, setUploadProgress] = React.useState<number | null>(
    null
  );

  const setWarningMessage = (m: string) => startTransition(() => setWarning(m));

  const setErrorMessage = (m: string) => startTransition(() => setError(m));

  const setSuccessMessage = (m: string) => startTransition(() => setSuccess(m));

  const setInfoMessage = (m: string) => startTransition(() => setInfo(m));

  const manageSnackbar = (m: string, severity: AlertProps['severity']) => {
    switch (severity) {
      case 'error':
        snackbarLoading && setSnackbarLoading(false);
        loading && setLoading(false);
        setWarningMessage('');
        setInfoMessage('');
        setSuccessMessage('');
        setErrorMessage(m);
        break;
      case 'info':
        setErrorMessage('');
        setWarningMessage('');
        setErrorMessage('');
        setInfoMessage(m);
        break;
      case 'success':
        uploadProgress && setUploadProgress(null);
        snackbarLoading && setSnackbarLoading(false);
        loading && setLoading(false);
        setWarningMessage('');
        setInfoMessage('');
        setErrorMessage('');
        setSuccessMessage(m);
        break;
      case 'warning':
        setErrorMessage('');
        setInfoMessage('');
        setSuccessMessage('');
        setWarningMessage(m);
        break;
    }
  };

  const setLoading = (state: boolean) =>
    startTransition(() => setLoadingState(state));

  const setSnackbarLoading = (state: boolean) =>
    startTransition(() => setSnackbarLoadingState(state));

  const setSelectedFolder = (folder: Folder) =>
    startTransition(() => setSelected(folder));

  // Load root path

  React.useEffect(() => {
    try {
      kernel.init().then(() => kernel.load(kernel.rootDirectory));
    } catch (e) {
      manageSnackbar(e.message, 'error');
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
      selected && setSelectedFolder(null);
    });

    return () => {
      loadEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for error event

  React.useEffect(() => {
    const errorEvent = kernel.on('error', message => {
      manageSnackbar(message ?? null, 'error');
    });

    return () => {
      errorEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for info event

  React.useEffect(() => {
    const infoEvent = kernel.on('info', info =>
      manageSnackbar(info ?? '', 'info')
    );

    return () => {
      infoEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for warning event

  React.useEffect(() => {
    const warningEvent = kernel.on('warning', warning =>
      manageSnackbar(warning ?? '', 'warning')
    );

    return () => {
      warningEvent.unsubscribe();
    };
  }, [kernel]);

  // Listen for idle (success) event

  React.useEffect(() => {
    const idleEvent = kernel.on('idle', success =>
      manageSnackbar(success ?? '', 'success')
    );

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
            event.total < 100
              ? setUploadProgress(
                  Math.round((event.loaded * 100) / event.total)
                )
              : setSnackbarLoading(true);
          } else {
            setUploadProgress(null);
            setSnackbarLoading(false);
          }
        });
      }
    });

    return () => uploadEvent.unsubscribe();
  }, [kernel]);

  // Listen for refresh event

  React.useEffect(() => {
    const refreshEvent = kernel.on('refresh', kernel.refresh);

    return () => refreshEvent.unsubscribe();
  }, [kernel]);

  // Clear warning

  React.useEffect(() => {
    if (warning && warning !== '') setTimeout(() => setErrorMessage(''), 6000);
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

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) =>
    manageSnackbar('', 'error');

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
        open={error !== '' || warning !== '' || success !== '' || info !== ''}
        //autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={
            error !== ''
              ? 'error'
              : warning !== ''
              ? 'warning'
              : info !== ''
              ? 'info'
              : 'success'
          }
          sx={{ width: '100%', borderRadius }}
        >
          <Stack spacing={1}>
            {error !== '' ? error : warning !== '' ? warning : info !== '' ? info : success}
            <Stack direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
              {uploadProgress && (
                <ProgressBar progress={uploadProgress} barWidth={350} />
              )}
              {snackbarLoading && <LoadingComponent width={20} height={20} />}
            </Stack>
          </Stack>
        </Alert>
      </Snackbar>
      <DashboardApiProvider>{children}</DashboardApiProvider>
    </DashboardContext.Provider>
  );
};
