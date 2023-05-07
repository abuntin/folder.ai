import { Color, createTheme, PaletteMode, PaletteOptions, responsiveFontSizes, Theme } from "@mui/material";
import React from "react";

export const ColorModeContext = React.createContext<{ mode: PaletteMode, toggleColorMode: { toggle: () => void } }>({
    mode: 'light' as PaletteMode,
    toggleColorMode: { toggle: () => {}}
});

export const bgLight = `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(43,54,200,1) 100%),
linear-gradient(45deg, rgba(124,199,185,1) 0%, rgba(254,177,121,1) 65%, rgba(255,255,0,1) 100%)`

export const bgDark = `linear-gradient(53deg, rgba(17,0,16,1) 0%, rgba(17,0,16,0.46) 59%, rgba(254,177,121,0.17) 95%, rgba(254,177,121,0.12) 100%), 
linear-gradient(154deg, rgba(17,0,16,1) 0%, rgba(20,33,61,1) 39%, rgba(43,51,104,1) 100%)`

export const createCustomTheme = (mode: PaletteMode) => {

    let palette = mode === 'light' ? ({
        common: { black: '#111010', white: '#fafafa' },
        primary: { main: '#fafafa', light: '#1b1a22' }, // white
        secondary: { main: '#110010', light: 'a7afb8', dark: '858a94' }, // black and silver
        warning: { main: '#eabb13' }, // yellow
        info: { main: 'rgba(84, 126, 193,1)' }, // blue
        success: { main: '#578346' }, // green
        disabled: { main: `rgba(229,229,229,0.5)`},
        error: { main: '#ff0033' }, // red 
        action: { active: 'rgba(56, 110, 217,0.85)' }, // darker default bg
        mode,
        grey: 600 as Partial<Color>,
        text:  { secondary: '#110010', primary: '#fafafa', disabled: '#E5E5E5' },
        background: { default: 'rgba(99,157,201,0.3)', paper: 'rgba(250, 250, 250, 0.3)'}, // gradient light blue, white
    }) as PaletteOptions : ({
        common: { black: '#111010', white: '#fafafa'},
        primary: { main: '#fafafa', light: '#1b1a22' },
        secondary: { main: '#110010', light: 'a7afb8', dark: '858a94' }, // black and silver
        error: { main: '#ff0033' }, // red 
        warning: { main: '#fca311' }, // yellow
        info: { main: 'rgba(32,42,83,1)' }, // blue
        success: { main: '#4BB543' }, // green
        action: { active: 'rgba(20,27,53,0.85)' }, // darker default bg
        mode,
        grey: 600 as Partial<Color>,
        text:  { primary: '#fafafa', secondary: '#110010', disabled: '#E5E5E5' },
        background: { default: 'rgba(229,229,229,0.3)', paper: 'rgba(250, 250, 250, 0.3)'}, // gradient dark blue, white
    }) as PaletteOptions


    let transitions = {
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            // most basic recommended timing
            standard: 300,
            // this is to be used in complex animations
            complex: 375,
            // recommended when something is entering screen
            enteringScreen: 225,
            // recommended when something is leaving screen
            leavingScreen: 195,
        },
    }
    
    let theme: Theme = createTheme({
        palette,
        transitions,
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

