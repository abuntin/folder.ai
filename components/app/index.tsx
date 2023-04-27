'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { m, spring } from 'framer-motion';
import 'dayjs/locale/en-gb';
import { Header, AnalyticsWrapper } from 'components';
import { AnimationWrapper } from 'components/animation';
import { ColorModeContext, createCustomTheme, bgDark, bgLight } from './theme';
import { KernelProvider } from './context';
import { Provider } from 'react-redux';
import { store } from 'lib/redux';

interface AppProps {
  children: React.ReactNode;
}

export const App: React.FC<AppProps> = props => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  const toggleColorMode = React.useMemo(
    () => ({
      toggle: () => {
        setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = React.useMemo(() => createCustomTheme(mode), [mode]);

  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
          <ThemeProvider theme={theme}>
            <AnimationWrapper>
              <KernelProvider>
                <m.body
                  style={{
                    flex: 'auto',
                    minHeight: '100%',
                    //height: '100%',
                    margin: 0,
                    background:
                      mode == 'light' ? `${bgLight} fixed` : `${bgDark} fixed`,
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover\200%',
                  }}
                  layout
                  transition={spring}
                >
                  <Header />
                  <main className="flex-auto min-w-0 mt-0 md:mt-0 flex flex-col px-0 md:px-0">
                    {props.children}
                    <AnalyticsWrapper />
                  </main>
                </m.body>
              </KernelProvider>
            </AnimationWrapper>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </LocalizationProvider>
    </Provider>
  );
};

export * from './context';
export * from './theme'
