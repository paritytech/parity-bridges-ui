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

import { Fade, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import HistoryIcon from '@material-ui/icons/History';
import Transactions from './Transactions';
import { useGUIContext } from '../contexts/GUIContextProvider';
import { ButtonDrawerMenu } from './Buttons';

const useStyles = makeStyles((theme) => ({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 200,
    width: 400,
    height: '100vh',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    paddingTop: theme.spacing(5),
    overflow: 'auto',
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  closeDrawerIcon: {
    position: 'fixed',
    backgroundColor: theme.palette.background.paper,
    marginLeft: 296,
    marginTop: theme.spacing(-4)
  }
}));

export const StorageDrawer = () => {
  const classes = useStyles();
  const { drawer, setDrawer } = useGUIContext();

  const handleDrawerOpen = useCallback(() => setDrawer(`${drawer === 'open' ? '' : 'open'}`), [drawer, setDrawer]);
  const handleDrawerClose = useCallback(() => setDrawer(''), [setDrawer]);

  return (
    <>
      <ButtonDrawerMenu
        startIcon={<HistoryIcon />}
        onClick={handleDrawerOpen}
        color={drawer === 'open' ? 'primary' : 'secondary'}
      >
        History
      </ButtonDrawerMenu>
      <Fade in={drawer === 'open'} timeout={300}>
        <div className={classes.drawer}>
          <IconButton onClick={handleDrawerClose} color="secondary" className={classes.closeDrawerIcon}>
            <CloseIcon />
          </IconButton>
          <Transactions />
        </div>
      </Fade>
    </>
  );
};
