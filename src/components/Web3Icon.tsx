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

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

interface Web3IconStyleProps {
  color?: string;
  backgroundColor?: string;
  size?: string;
}
interface Web3IconProps extends Web3IconStyleProps {
  children: string;
}

const web3IconGlyphs = ['polkadot', 'kusama', 'kulupu', 'westend', 'statemine', 'rococo', 'substrate'];

const useStyles = makeStyles<Theme, Web3IconStyleProps>((theme) => ({
  icon: {
    display: 'inline-block',
    position: 'relative',
    zIndex: 2,
    marginleft: ({ size }) => `calc(${size} * 0.5)`,
    marginRight: ({ size }) => `calc(${size} * 0.5)`,
    color: ({ color }) => color || theme.palette.text.primary,
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontSize: ({ size }) => size,
    textAlign: 'center',
    '&:after': {
      content: '" "',
      position: 'absolute',
      zIndex: -1,
      display: 'block',
      width: ({ size }) => `calc(${size} * 1.3)`,
      height: ({ size }) => `calc(${size} * 1.3)`,
      top: '-9999px',
      bottom: '-9999px',
      left: '-9999px',
      right: '-9999px',
      margin: 'auto',
      borderRadius: '50%',
      backgroundColor: ({ backgroundColor }) => backgroundColor || 'transparent'
    }
  }
}));

export const Web3Icon = ({ color, backgroundColor, size = '1em', children }: Web3IconProps) => {
  const classes = useStyles({ color, backgroundColor, size });

  if (web3IconGlyphs.indexOf(children.toLowerCase()) === -1) {
    return <></>;
  }
  return <div className={`Web3Icon ${classes.icon}`}>{children}</div>;
};
