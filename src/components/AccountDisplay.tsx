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

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import ctx from 'classnames';
import React from 'react';

import shorterItem from '../util/shortenItem';
import AccountIdenticon from './AccountIdenticon';

interface Props {
  address: string;
  accountName?: string | null;
  isDerived?: boolean;
  onClick?: any;
  balance?: string | null | undefined;
  fromSender?: boolean;
}

const useStyles = makeStyles(() => ({
  onlyBalance: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    padding: '0 10px'
  },
  icon: {
    float: 'left'
  },
  container: {
    display: 'flex',
    minWidth: '100%',
    padding: '0 10px',
    alignItems: 'center'
  },
  address: {
    marginLeft: '10px'
  },
  balances: {
    marginLeft: 'auto'
  }
}));

const AccountDisplay = ({ accountName, address, balance, isDerived = false, onClick, fromSender = false }: Props) => {
  const classes = useStyles();
  const displayText = () => {
    if (isDerived && accountName) {
      return `derived(${accountName})`;
    }
    if (isDerived && !accountName) {
      return `derived(${shorterItem(address)})`;
    }
    if (accountName) {
      return `${accountName} (${shorterItem(address)})`;
    }
    if (!accountName) {
      return shorterItem(address);
    }
    return accountName;
  };

  if (fromSender) {
    return (
      <Container onClick={onClick} className={classes.onlyBalance}>
        <p>{balance || '-'}</p>
      </Container>
    );
  }

  return (
    <Container onClick={onClick} className={classes.container}>
      <div className={classes.icon}>
        <AccountIdenticon address={address} />
      </div>
      <div className={classes.address}>
        <p>{displayText()}</p>
      </div>
      <div className={classes.balances}>
        <p>{balance || '-'}</p>
      </div>
    </Container>
  );
};

export default AccountDisplay;
