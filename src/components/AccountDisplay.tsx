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
import styled from 'styled-components';

import shorterItem from '../util/shortenItem';
import AccountIdenticon from './AccountIdenticon';

interface Props {
  address: string;
  accountName?: string | null;
  className?: string;
  isDerived?: boolean;
  onClick?: any;
  balance?: string | null | undefined;
  hasBorder?: boolean;
  fromSender?: boolean;
}

const useStyles = makeStyles(() => ({
  border: {
    border: '1px solid grey'
  },
  onlyBalance: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%'
  }
}));

const AccountDisplay = ({
  className,
  accountName,
  address,
  balance,
  isDerived = false,
  onClick,
  hasBorder = false,
  fromSender = false
}: Props) => {
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
        <p>{balance ? balance : '-'}</p>
      </Container>
    );
  }

  // TO-DO to replace icon
  return (
    <div className={ctx(hasBorder && classes.border)}>
      <Container onClick={onClick} className={className}>
        <div className="icon">
          <AccountIdenticon address={address} />
        </div>
        <div className="address">
          <p>{displayText()}</p>
        </div>
        <div className="balance">
          <p>{balance ? balance : '-'}</p>
        </div>
      </Container>
    </div>
  );
};

export default styled(AccountDisplay)`
  margin: auto 0;
  display: flex;
  justify-content: space-between;
  min-width: 100%;
  .icon {
    float: left;
  }
  .address {
    float: left;
    margin-left: 10px;
    min-width: 80%;
  }

  .balances {
    min-width: 20%;
    float: right;
    padding: 5px;
    border: 1px solid;
  }

  .border {
    border: 1px solid grey;
  }

  .onlyBalance {
    min-width: 100%;
    float: right;
  }
`;
