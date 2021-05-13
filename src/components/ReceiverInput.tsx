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

interface Props {
  setError: (value: string) => void;
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '0',
    float: 'left'
  },
  row: {
    border: '1px solid grey',
    borderRadius: '5px 5px 0 0',
    display: 'flex',
    padding: '10px 20px',
    alignItems: 'center'
  },
  address: {
    marginLeft: '10px'
  },
  balance: {
    marginLeft: 'auto'
  },
  input: {
    marginLeft: '10px',
    width: '80%'
  }
}));

// TODO: To refactor state management for this component #160

function ReceiverInput({ setError }: Props) {
  const classes = useStyles();
  const [formatFound, setFormatFound] = useState('');
  const [showBalance, setShowBalance] = useState(false);

  const { setReceiver, setUnformattedReceiver, validateAccount } = useReceiver();

  const { dispatchTransaction } = useUpdateTransactionContext();
  const { receiverAddress, unformattedReceiverAddress } = useTransactionContext();

  const { api, address } = useApiBalance(unformattedReceiverAddress, formatFound, false);

  const state = useBalance(api, address, true);

  const {
    targetChainDetails: { targetChain },
    sourceChainDetails: { sourceChain }
  } = useSourceTarget();
  const prevTargetChain = usePrevious(targetChain);

  const reset = useCallback(() => {
    dispatchTransaction(TransactionActionCreators.setGenericAccount(null));
    dispatchTransaction(TransactionActionCreators.setDerivedAccount(null));
    dispatchTransaction(TransactionActionCreators.setReceiverAddress(null));
    setShowBalance(false);
    setError('');
  }, [dispatchTransaction, setError]);

  useEffect(() => {
    if (prevTargetChain !== targetChain) {
      reset();
      setUnformattedReceiver(null);
    }
    if (!unformattedReceiverAddress) {
      setShowBalance(false);
    }
  }, [unformattedReceiverAddress, setUnformattedReceiver, prevTargetChain, receiverAddress, reset, targetChain]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const receiver = event.target.value;
    reset();
    setUnformattedReceiver(receiver);
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
      setShowBalance(true);
      return;
    }

    if (formatFound === sourceChain) {
      dispatchTransaction(TransactionActionCreators.setDerivedAccount(formattedAccount));
      setReceiver(receiver);
      return;
    }

    setError(`Unsupported address SS58 prefix: ${formatFound}`);
  };

  const addressInput = unformattedReceiverAddress || '';
  return (
    <Container className={classes.container}>
      <div className={classes.row}>
        <AccountIdenticon address={addressInput} formatFound={formatFound} />
        <div className={classes.input}>
          <InputBase fullWidth onChange={onChange} value={addressInput} placeholder="recipient address" />
        </div>
        <div className={classes.balance}>
          <p>{showBalance && state && state.formattedBalance}</p>
        </div>
      </div>
    </Container>
  );
}

export default ReceiverInput;
