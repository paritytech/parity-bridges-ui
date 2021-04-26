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

import { Box, Container, Paper } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import React from 'react';

import { substrateGray } from './theme';

// As this is placed as a child in the Material UI Select component, for some reason style components classes are not working.
// This way to inject the styles works.
const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  },
  ui: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
    '& .MuiPaper-root': {
      maxWidth: '100%',
      padding: theme.spacing(2),
      borderRadius: theme.spacing(1.5)
    }
  },
  sidebar: {
    width: 240,
    '& .inner': {
      position: 'fixed',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      top: 0,
      width: 240,
      padding: theme.spacing(3),
      height: '100vh',
      backgroundColor: substrateGray[50],
      borderRight: `1px solid ${fade(theme.palette.divider, 0.5)}`
    },
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  }
}));

interface BoxUIProps {
  children: React.ReactElement[] | React.ReactElement | string;
}

export const BoxMain = ({ children }: BoxUIProps) => {
  const classes = useStyles();
  return <Box className={classes.main}>{children}</Box>;
};

export const BoxUI = ({ children }: BoxUIProps) => {
  const classes = useStyles();
  return (
    <Container className={classes.ui}>
      <Paper elevation={24}>{children}</Paper>
    </Container>
  );
};

export const BoxSidebar = ({ children }: BoxUIProps) => {
  const classes = useStyles();
  return (
    <Box className={classes.sidebar}>
      <div className="inner">{children}</div>
    </Box>
  );
};
