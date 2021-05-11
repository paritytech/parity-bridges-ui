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

import { Box, Drawer, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import HistoryIcon from '@material-ui/icons/History';
import Transactions from './Transactions';
import { DrawerContext } from '../contexts/GUIContextProvider';
import { ButtonDrawerMenu } from './Buttons';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 240,
    flexShrink: 0,
    '& .MuiPaper-root': {
      padding: theme.spacing(2),
      left: 240 - 1
    }
  }
}));

export const StorageDrawer = () => {
  const classes = useStyles();
  const { drawer, setDrawer } = useContext(DrawerContext);

  const handleDrawerOpen = () => {
    setDrawer(`${drawer === 'open' ? 'closed' : 'open'}`);
  };

  const handleDrawerClose = () => {
    setDrawer('closed');
  };

  return (
    <>
      <ButtonDrawerMenu
        startIcon={<HistoryIcon />}
        onClick={handleDrawerOpen}
        color={drawer === 'open' ? 'primary' : 'secondary'}
      >
        History
      </ButtonDrawerMenu>
      <Drawer open={drawer === 'open'} variant="persistent" className={classes.drawer}>
        <Box width="100%" textAlign="right">
          <IconButton onClick={handleDrawerClose} color="secondary">
            <CloseIcon />
          </IconButton>
        </Box>
        <Transactions />
      </Drawer>
    </>
  );
};
