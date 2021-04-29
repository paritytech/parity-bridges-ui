// Copyright 2021 Parity Technologies (UK) Ltd.
// This file is part of Parity Bridges UI.
//
// Parity Bridges UI is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Parity Bridges UI is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Parity Bridges UI.  If not, see <http://www.gnu.org/licenses/>.

import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import { ThemeOptions } from '@material-ui/core/styles';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import { Shadows } from '@material-ui/core/styles/shadows';

export const bridgesBlue = {
  100: '#2E99E5',
  300: '#2E99E5',
  400: '#2E99E5',
  500: '#2E99E5'
};
export const substrateGray = {
  50: '#FCFCFC',
  100: '#F5F8FA',
  150: '#F0F2F5',
  200: '#EAEEF1',
  400: '#C6D0D7',
  500: '#ABB8BF',
  700: '#556068',
  600: '#7E8D95',
  800: '#323F47',
  900: '#202B33'
};

const paletteLight: PaletteOptions = {
  type: 'light',
  common: {
    black: 'black',
    white: '#FFFFFF'
  },
  background: {
    paper: '#FFFFFF',
    default: '#FFFFFF'
  },
  primary: {
    light: bridgesBlue[100],
    main: bridgesBlue[400],
    dark: bridgesBlue[500],
    contrastText: 'white'
  },
  secondary: {
    light: substrateGray[100],
    main: substrateGray[150],
    dark: substrateGray[500],
    contrastText: 'black'
  },
  error: {
    light: red[100],
    main: '#FF3014',
    dark: red[500],
    contrastText: 'black'
  },
  text: {
    primary: substrateGray[900],
    secondary: bridgesBlue[400],
    disabled: substrateGray[400],
    hint: substrateGray[700]
  },
  action: {
    active: bridgesBlue[300]
  },
  divider: grey[300]
};

const shadows: Shadows = [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
  '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
  '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
  '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
  '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
  '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
  '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
  '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
  '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
  '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
  '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
  '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
  '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
  '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
  '0px 100px 80px rgba(0, 0, 0, 0.07), 0px 40px 32px rgba(0, 0, 0, 0.05), 0px 20px 20px rgba(0, 0, 0, 0.04), 0px 12px 12px rgba(0, 0, 0, 0.04), 0px 6px 6px rgba(0, 0, 0, 0.03), 0px 3px 2px rgba(0, 0, 0, 0.02)'
];

export const light: ThemeOptions = {
  typography: {
    allVariants: {
      color: paletteLight.text && paletteLight.text.primary
    },
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, Segoe UI, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Web3-Regular"',
    h1: {
      fontWeight: 500,
      fontSize: 30,
      lineHeight: '115%',
      letterSpacing: '-0.02em'
    },
    h2: {
      fontWeight: 600,
      fontSize: 21,
      lineHeight: '120%'
    },
    h3: {
      fontWeight: 600,
      fontSize: 18,
      lineHeight: '120%'
    },
    h4: {
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '120%',
      color: grey[800]
    },
    body1: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '140%',
      color: grey[800]
    },
    body2: {
      fontWeight: 400,
      fontSize: 12,
      lineHeight: '135%',
      letterSpacing: 0.25
    },
    button: {
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '140%',
      letterSpacing: 0.2,
      textTransform: 'none'
    },
    subtitle1: {
      fontFamily: 'SFMono-Regular, Consolas , Liberation Mono, Menlo, monospace',
      fontWeight: 400,
      fontSize: 20,
      lineHeight: '120%'
    },
    subtitle2: {
      fontFamily: 'SFMono-Regular, Consolas , Liberation Mono, Menlo, monospace',
      fontWeight: 400,
      fontSize: 11,
      lineHeight: '135%',
      color: grey[700],
      letterSpacing: 0.1
    },
    overline: {
      fontSize: 11,
      lineHeight: '120%',
      letterSpacing: 0.7
    }
  },
  palette: paletteLight,
  shadows: shadows
};
