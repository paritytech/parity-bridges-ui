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

import { Container, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { INCORRECT_FORMAT, GENERIC } from '../constants';
import { TransactionActionCreators } from '../actions/transactionActions';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext, useUpdateTransactionContext } from '../contexts/TransactionContext';
import useApiBalance from '../hooks/useApiBalance';
import useBalance from '../hooks/useBalance';
import usePrevious from '../hooks/usePrevious';

import useReceiver from '../hooks/useReceiver';
import AccountIdenticon from './AccountIdenticon';

const useStyles = makeStyles(() => ({
  container: {
    padding: '0',
    float: 'left'
  },
  row: {
    border: '1px solid grey',
    borderRadius: '5px 5px 0 0',
    display: 'flex',
    padding: '10px'
  },
  address: {
    marginLeft: '10px'
  },
  balances: {
    marginLeft: 'auto'
  },
  input: {
    marginLeft: '10px',
    width: '80%'
  }
}));

function ReceiverInput() {
  const classes = useStyles();
  const [addressInput, setAddresInput] = useState('');
  const [formatFound, setFormatFound] = useState('');
  const [error, setError] = useState('');

  const [showBalance, setShowBalance] = useState(false);

  const { setReceiver, validateAccount } = useReceiver();

  const { dispatchTransaction } = useUpdateTransactionContext();
  const { receiverAddress } = useTransactionContext();
  const { api, address } = useApiBalance(addressInput, formatFound, false);
  const state = useBalance(api, address, true);

  const {
    targetChainDetails: { targetChain }
  } = useSourceTarget();
  const prevTargetChain = usePrevious(targetChain);

  const reset = useCallback(() => {
    dispatchTransaction(TransactionActionCreators.setGenericAccount(null));
    dispatchTransaction(TransactionActionCreators.setDerivedAccount(null));
    setShowBalance(false);
    setError('');
  }, [dispatchTransaction]);

  useEffect(() => {
    if (prevTargetChain !== targetChain) {
      reset();
      setAddresInput('');
    }
  }, [addressInput, prevTargetChain, receiverAddress, reset, targetChain]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const receiver = event.target.value;
    reset();
    setAddresInput(receiver);
    if (!receiver) {
      return;
    }

    const { formattedAccount, formatFound } = validateAccount(receiver)!;
    setFormatFound(formatFound);
    if (formatFound === INCORRECT_FORMAT) {
      setError('Invalid address.');
      return;
    }

    if (formatFound === GENERIC) {
      dispatchTransaction(TransactionActionCreators.setGenericAccount(receiver));
      return;
    }

    if (formatFound === targetChain) {
      setReceiver(formattedAccount);
    } else {
      dispatchTransaction(TransactionActionCreators.setDerivedAccount(formattedAccount));
      setReceiver(receiver);
    }

    setShowBalance(true);
  };

  return (
    <Container className={classes.container}>
      <div className={classes.row}>
        <AccountIdenticon address={addressInput} />
        <div className={classes.input}>
          <InputBase fullWidth onChange={onChange} value={addressInput} placeholder="address" />
        </div>

        <p>{showBalance && state && state.formattedBalance}</p>
      </div>
      <div>
        <p>{error && error}</p>
      </div>
    </Container>
  );
}

export default ReceiverInput;
