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
import Autocomplete from '@material-ui/lab/Autocomplete';
import { styleAccountCompanion } from '.';
import { useAccountContext } from '../contexts/AccountContextProvider';
import AccountDisplay from './AccountDisplay';
import BridgedLocalWrapper from './BridgedLocalWrapper';
import { Account, AddressKind } from '../types/accountTypes';
import isNull from 'lodash/isNull';
import { TextField } from '@material-ui/core';
import useAccounts from '../hooks/accounts/useAccounts';

const useStyles = makeStyles((theme) => ({
  networkHeading: {
    padding: theme.spacing(2),
    paddingBottom: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
    ...theme.typography.overline,
    color: theme.palette.text.hint,
    '&:first-child': {
      paddingTop: 0,
      border: 'none'
    }
  },
  selectAccountMainItem: {
    display: 'block',
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing()
  },
  accountMain: {
    '& .MuiSelect-select': {
      padding: theme.spacing(1.25),
      paddingTop: theme.spacing(0.5),
      paddingRight: theme.spacing(3),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.spacing(1.5)
    }
  },
  bridgedBottomBorders: {
    '& .MuiSelect-select': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }
  },
  accountCompanion: {
    ...styleAccountCompanion(theme)
  }
}));

const getName = (account: Account) => (account!.meta.name as string).toLocaleUpperCase();

export default function Sender() {
  const { setCurrentAccount } = useAccounts();
  const {
    displaySenderAccounts: options,
    account,
    companionAccount,
    senderAccountBalance,
    senderCompanionAccountBalance
  } = useAccountContext();
  const classes = useStyles();

  return (
    <>
      <Autocomplete
        options={options}
        groupBy={(option) => option.sourceChain}
        getOptionLabel={(option) => option.sourceAccount.name || ''}
        onChange={setCurrentAccount}
        disableClearable
        renderInput={(params) => (
          <TextField
            label="Sender"
            placeholder="Please select account"
            value={`${account?.address} ${senderAccountBalance?.formattedBalance}`}
            {...params}
            variant="outlined"
          />
        )}
        renderOption={(option) => (
          <div className={classes.selectAccountMainItem}>
            <AccountDisplay
              friendlyName={option.sourceAccount.name}
              address={option.sourceAccount.address}
              balance={option.sourceAccount.balance.formattedBalance}
            />
            <AccountDisplay
              friendlyName={option.companionAccount.name}
              address={option.companionAccount.address}
              balance={option.companionAccount.balance.formattedBalance}
            />
          </div>
        )}
      />
      <BridgedLocalWrapper>
        <div className={classes.accountCompanion}>
          {companionAccount && !isNull(senderCompanionAccountBalance) ? (
            <AccountDisplay
              friendlyName={getName(account)}
              address={companionAccount}
              addressKind={AddressKind.COMPANION}
              balance={senderCompanionAccountBalance!.formattedBalance}
              hideAddress
              withTooltip
            />
          ) : (
            <AccountDisplay friendlyName="Sender" addressKind={AddressKind.COMPANION} hideAddress />
          )}
        </div>
      </BridgedLocalWrapper>
    </>
  );
}
