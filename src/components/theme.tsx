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

export const substrateGreen = {
  100: '#7E8D96',
  200: '#5CFFC8',
  300: '#18FFB2',
  400: '#16DB9A',
  500: '#11B37C',
  600: '#1A9A6C'
};
export const substrateGray = {
  100: '#F5F8FA',
  200: '#EAEEF1',
  400: '#C6D0D7',
  500: '#ABB8BF',
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
    light: substrateGreen[100],
    main: substrateGreen[400],
    dark: substrateGreen[500],
    contrastText: 'black'
  },
  secondary: {
    light: substrateGreen[100],
    main: substrateGreen[400],
    dark: substrateGreen[500],
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
    secondary: '#fff',
    disabled: grey[300],
    hint: grey[700]
  },
  action: {
    active: substrateGreen[300]
  },
  divider: grey[300]
};

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
      fontSize: 14,
      lineHeight: '120%',
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
      fontSize: 12,
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
  palette: paletteLight
};
