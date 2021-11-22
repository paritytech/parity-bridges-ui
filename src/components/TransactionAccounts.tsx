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
import { Box, makeStyles } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AccountDisplay from './AccountDisplay';
import { AddressKind } from '../types/accountTypes';
import { TransactionTypes } from '../types/transactionTypes';
import { styleAccountCompanion } from '.';

interface Props {
  sourceAccount: string | undefined;
  senderCompanionAccount: string | undefined;
  senderName?: string | null;
  receiverAddress?: string | undefined;
  type: TransactionTypes;
}

const useStyles = makeStyles((theme) => ({
  accountMain: {
    padding: theme.spacing(1.25),
    paddingTop: theme.spacing(0.8),
    paddingRight: theme.spacing(0),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1.5)
  },
  withoutBottomBorderRadius: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  sender: {
    padding: theme.spacing(1.25),
    paddingTop: theme.spacing(0.9),
    paddingRight: theme.spacing(0),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1.5)
  },
  accountCompanion: {
    ...styleAccountCompanion(theme)
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

const TransactionAccounts = ({ sourceAccount, senderName, senderCompanionAccount, receiverAddress, type }: Props) => {
  const classes = useStyles();
  const isInternal = type === TransactionTypes.INTERNAL_TRANSFER;
  const isTransfer = isInternal || type === TransactionTypes.TRANSFER;
  return (
    <Box className="header" component="p" id="test-transaction-header">
      <Box
        className={cx(classes.accountMain, !isInternal ? classes.withoutBottomBorderRadius : '')}
        id="test-sender-component"
      >
        <AccountDisplay address={sourceAccount} friendlyName={senderName} />
      </Box>
      {!isInternal && (
        <Box className={classes.accountCompanion}>
          <AccountDisplay
            address={senderCompanionAccount}
            addressKind={AddressKind.COMPANION}
            hideAddress
            friendlyName={senderName}
            withTooltip
          />
        </Box>
      )}
      {isTransfer && (
        <>
          <Box marginY={2} textAlign="center" width="100%">
            <ArrowDownwardIcon fontSize="large" color="primary" />
          </Box>
          <Box className={classes.sender}>
            <AccountDisplay address={receiverAddress} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default TransactionAccounts;
