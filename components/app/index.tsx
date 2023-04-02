import { createTheme, Color, responsiveFontSizes, Theme, PaletteMode, PaletteOptions } from "@mui/material";
import React from "react";

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });


export const bgLight = `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(87,131,70,1) 100%),
linear-gradient(45deg, rgba(124,199,185,1) 0%, rgba(254,177,121,1) 65%, rgba(255,255,0,1) 100%)`

export const bgDark = `linear-gradient(53deg, rgba(17,0,16,1) 0%, rgba(17,0,16,0.46) 59%, rgba(254,177,121,0.17) 95%, rgba(254,177,121,0.12) 100%), linear-gradient(154deg, rgba(17,0,16,1) 0%, rgba(20,33,61,1) 39%, rgba(87,131,70,1) 100%)`

export const createCustomTheme = (mode: PaletteMode) => {

    let palette = mode === 'light' ? ({
        common: { black: '#111010'},
        primary: { main: '#EABB13', dark: '#EABB13', light: '#7CC7B9' },
        secondary: { main: '#578346', light: '#578346', dark: '#7CC7B9' }, // yellow 
        error: { main: '#ff0033' }, // red 
        warning: { main: '#fca311' }, // yellow
        info: { main: '#14213d' }, // blue
        success: { main: '#4BB543' }, // green
        mode,
        grey: 600 as Partial<Color>,
        text:  { secondary: '#fafafa', primary: '#110010', disabled: '#E5E5E5' },
        background: { paper: '#f6f6f6', default: '#fafafa'},
    }) : ({
        common: { black: '#111010', white: '#fafafa'},
        primary: { main: '#fafafa' },
        secondary: { main: '#fca311' }, // yellow 
        error: { main: '#ff0033' }, // red 
        warning: { main: '#fca311' }, // yellow
        info: { main: '#14213d' }, // blue
        success: { main: '#4BB543' }, // green
        mode,
        grey: 600 as Partial<Color>,
        text:  { primary: '#fafafa', secondary: '#110010', disabled: '#E5E5E5' },
        background: { paper: '#1b1a22', default: '#111010'},
    }) as PaletteOptions


    let theme: Theme = createTheme({
        palette,
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
            fontSize: 10,
            fontWeightBold: 700,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
        },
        
    })

    theme = responsiveFontSizes(theme);

    return theme
}

