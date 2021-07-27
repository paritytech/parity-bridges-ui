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
import { Box, BoxProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

interface Web3IconProps extends BoxProps {
  color?: string;
  backgroundColor?: string;
}

const useStyles = makeStyles<Theme, Web3IconProps>((theme) => ({
  background: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(0.25),
    marginLeft: theme.spacing(0.25),
    borderRadius: '50%',
    backgroundColor: ({ backgroundColor }) => backgroundColor || 'transparent'
  },
  icon: {
    color: ({ color }) => color || theme.palette.text.primary
  }
}));

export const Web3Icon = ({ color, backgroundColor, children }: Web3IconProps) => {
  const classes = useStyles({ color, backgroundColor });
  return (
    <Box className={classes.background}>
      <Box className={`Web3Icon ${classes.icon}`}>{children}</Box>
    </Box>
  );
};
