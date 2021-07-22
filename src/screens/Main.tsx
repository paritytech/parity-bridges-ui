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
import { Box, Typography } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { BoxSidebar, BoxUI, ButtonExt, StorageDrawer, MenuAction, NetworkSides, NetworkStats } from '../components';
import CustomCall from '../components/CustomCall';
import ExtensionAccountCheck from '../components/ExtensionAccountCheck';
import Remark from '../components/Remark';
import Sender from '../components/Sender';
import SnackBar from '../components/SnackBar';
import Transfer from '../components/Transfer';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Transactions from '../components/Transactions';
import { useGUIContext } from '../contexts/GUIContextProvider';
import { TransactionTypes } from '../types/transactionTypes';
import { MenuActionItemsProps } from '../types/guiTypes';

import BridgedLocalWrapper from '../components/BridgedLocalWrapper';

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 'auto',
    maxHeight: '25px'
  }
}));

const ActionComponents = {
  [TransactionTypes.TRANSFER]: <Transfer />,
  [TransactionTypes.REMARK]: <Remark />,
  [TransactionTypes.CUSTOM]: <CustomCall />
};

function Main() {
  const classes = useStyles();
  const { actions, action, setAction, isBridged, setBridged } = useGUIContext();
  const searchItems = (choice: TransactionTypes) => actions.find((x: MenuActionItemsProps) => x.type === choice);

  const handleOnSwitch = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setBridged(Boolean(newAlignment));
  };

  // To remove this check once the whole functionality is ready.
  const isDev = process.env.REACT_APP_IS_DEVELOPMENT === 'true';
  // TODO: ToggleButtonGroup needs to contain the colors designed by custom css.
  // color property is not working for some reason.

  return (
    <>
      <BoxSidebar>
        <div>
          <Typography variant="button">Bridges UI</Typography>
          <NetworkSides />
          <BridgedLocalWrapper blurred>
            <NetworkStats />
          </BridgedLocalWrapper>
          <StorageDrawer />
        </div>
        <ButtonExt> Help & Feedback </ButtonExt>
      </BoxSidebar>
      <BoxUI>
        <Box component="div" display="flex" marginY={2} textAlign="left" width="100%">
          <MenuAction actions={actions} action={action} changeMenu={setAction} />
          {isDev && (
            <ToggleButtonGroup
              size="small"
              value={isBridged}
              exclusive
              onChange={handleOnSwitch}
              classes={{ root: classes.root }}
            >
              <ToggleButton value={false}>Local</ToggleButton>
              <ToggleButton value={true}>Bridge</ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>

        <ExtensionAccountCheck component={<Sender />} />
        <Box marginY={2} textAlign="center" width="100%">
          <ArrowDownwardIcon fontSize="large" color="primary" />
        </Box>
        <>{ActionComponents[action]}</>
        <Transactions type={searchItems(action)?.title} />
        <SnackBar />
      </BoxUI>
    </>
  );
}

export default Main;
