'use client'

import * as React from 'react' 
import { Color } from '@mui/material';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';


import Sidebar from '../components/sidebar';
import AnalyticsWrapper from '../components/analytics';

const theme: Theme = createTheme({
    palette: {
        primary: { main: '#fafafa' },
        secondary: { main: '#fca311' },
        error: { main: '#ff0033' },
        warning: { main: '#fafafa' },
        info: { main: '#14213d' },
        success: { main: '#4BB543' },
        mode: 'dark',
        grey: 600 as Partial<Color>,
        text:  { primary: '#fafafa', secondary: '#000000', disabled: '#E5E5E5'},
        // divider: string,
        // action: Partial<TypeAction>,
        background: { default: '#1b1a22'},
        // getContrastText: (background: string) => string,
    },
    typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        fontSize: 14,
        fontWeightBold: 700,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500
    },
})

interface AppProps {
    children: React.ReactNode;
} 

const App: React.FC<AppProps> = (props) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <ThemeProvider theme={theme}>
                {/* <Sidebar /> */}
                <main className="flex-auto min-w-0 mt-2 md:mt-0 flex flex-col px-2 md:px-0">
                    {props.children}
                    <AnalyticsWrapper />
                </main>
            </ThemeProvider>
        </LocalizationProvider>
    )
} 
 
 

export default App