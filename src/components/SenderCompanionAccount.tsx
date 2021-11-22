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
import AccountDisplay from './AccountDisplay';
import { useAccountContext } from '../contexts/AccountContextProvider';
import { makeStyles } from '@material-ui/core/styles';
import { AddressKind } from '../types/accountTypes';
import { styleAccountCompanion } from '.';
import isNull from 'lodash/isNull';
import { getName } from '../util/accounts';

import BridgedLocalWrapper from './BridgedLocalWrapper';

const useStyles = makeStyles((theme) => ({
  accountMain: {
    padding: theme.spacing(1.25),
    paddingTop: theme.spacing(0.5),
    paddingRight: theme.spacing(0),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1.5),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  accountCompanion: {
    ...styleAccountCompanion(theme)
  },
  sender: {
    minHeight: theme.spacing(10)
  },
  paper: {
    minWidth: theme.spacing(60),
    maxHeight: theme.spacing(50)
  },
  senderActions: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  icon: {
    marginLeft: 'auto'
  },
  account: {
    width: '100%'
  }
}));

export default function SenderCompanionAccount() {
  const classes = useStyles();
  const { account, companionAccount, senderCompanionAccountBalance, senderBalanceAccountLoading } = useAccountContext();

  return (
    <BridgedLocalWrapper>
      <div className={classes.accountCompanion}>
        {companionAccount && !isNull(senderCompanionAccountBalance) ? (
          <AccountDisplay
            senderBalanceAccountLoading={senderBalanceAccountLoading}
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
  );
}
