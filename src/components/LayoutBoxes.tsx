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

import { Container, Paper } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { DrawerContext } from '../contexts/GUIContextProvider';

import { substrateGray } from './theme';

// TODO: transitions
const useStyles = makeStyles((theme) => ({
  ui: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
    paddingLeft: 240 + theme.spacing(3),
    '&.open': {
      paddingLeft: 480 + theme.spacing(3)
    },
    '& .MuiPaper-root': {
      maxWidth: '100%',
      padding: theme.spacing(2),
      borderRadius: theme.spacing(1.5)
    }
  },
  sidebar: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    top: 0,
    width: 240,
    height: '100vh',
    padding: theme.spacing(3),
    backgroundColor: substrateGray[50],
    borderRight: `1px solid ${fade(theme.palette.divider, 0.5)}`
  }
}));

interface BoxUIProps {
  children: React.ReactElement[] | React.ReactElement | string;
}

export const BoxUI = ({ children }: BoxUIProps) => {
  const classes = useStyles();
  const { drawer } = useContext(DrawerContext);

  return (
    <Container className={`${classes.ui} ${drawer}`}>
      <Paper elevation={24}>{children}</Paper>
    </Container>
  );
};

export const BoxSidebar = ({ children }: BoxUIProps) => {
  const classes = useStyles();
  return <div className={classes.sidebar}>{children}</div>;
};
