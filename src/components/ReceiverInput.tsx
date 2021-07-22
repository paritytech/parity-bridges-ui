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
import cx from 'classnames';
import { Box, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTransactionContext } from '../contexts/TransactionContext';
import useApiBalance from '../hooks/subscriptions/useApiBalance';
import useBalance from '../hooks/subscriptions/useBalance';
import useReceiver from '../hooks/transactions/useReceiver';
import AccountIdenticon from './AccountIdenticon';
import { SelectLabel } from '../components';
import Balance from './Balance';
import { useGUIContext } from '../contexts/GUIContextProvider';

const useStyles = makeStyles((theme) => ({
  accountMain: {
    padding: theme.spacing(1.25),
    paddingTop: theme.spacing(0.5),
    paddingRight: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1.5),
    '& input': {
      color: theme.palette.text.secondary
    }
  },
  bridgedBottomBorders: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  address: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: '100%',
    overflow: 'auto'
  }
}));

// TODO: To refactor state management for this component #160

function ReceiverInput() {
  const classes = useStyles();
  const { isBridged } = useGUIContext();
  const { onReceiverChange } = useReceiver();
  const { unformattedReceiverAddress, formatFound, showBalance } = useTransactionContext();
  const { api, address } = useApiBalance(unformattedReceiverAddress, formatFound, false);
  const state = useBalance(api, address, true);

  const addressInput = unformattedReceiverAddress || '';
  return (
    <div className={cx(classes.accountMain, isBridged ? classes.bridgedBottomBorders : '')}>
      <SelectLabel>Receiver</SelectLabel>
      <Box display="flex" alignItems="center">
        <AccountIdenticon address={addressInput} formatFound={formatFound} />
        <InputBase
          id="test-receiver-input"
          className={classes.address}
          fullWidth
          onChange={onReceiverChange}
          autoComplete="off"
          value={addressInput}
          placeholder="Recipient address"
        />
        {showBalance && state && <Balance balance={state.formattedBalance} id="test-receiver-balance" />}
      </Box>
    </div>
  );
}

export default ReceiverInput;
