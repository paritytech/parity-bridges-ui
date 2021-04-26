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

import { Container, InputBase } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useAccountContext } from '../contexts/AccountContextProvider';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useReceiver from '../hooks/useReceiver';
import Account from './Account';
import GenericAddress from './GenericAccount';
import ReceiverInput from './ReceiverInput';
interface Props {
  className?: string;
}
const emptyReceiverToDerive = { formatFound: '', formattedAccount: '' };

const AccountInput = ({ className }: Props) => {
  const { genericAccount, derivedAccount } = useAccountContext();

  const {
    targetChainDetails: { targetChain }
  } = useSourceTarget();
  console.log('derivedAccount', derivedAccount);
  return (
    <Container className={className}>
      <ReceiverInput />
      <div className="values">
        {derivedAccount && (
          <div>
            <Account value={derivedAccount} chain={targetChain} isDerived hasBorder />{' '}
          </div>
        )}

        {genericAccount && (
          <div className="genericAddress">
            <GenericAddress value={genericAccount} />
          </div>
        )}
      </div>
    </Container>
  );
};

export default styled(AccountInput)`
  margin: auto 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  min-width: 100%;
  .icon {
    min-width: 20%;
    float: left;
  }
  .address {
    min-width: 60%;
  }
  .balances {
    min-width: 20%;
    float: right;
    padding: 5px;
    border: 1px solid;
  }
  .values {
    display: flex;
    flex-direction: column;
  }
  .input {
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid grey;
    padding: 5px 10px;
  }
  .genericAddress {
    display: flex;
    justify-content: space-between;
  }
`;
