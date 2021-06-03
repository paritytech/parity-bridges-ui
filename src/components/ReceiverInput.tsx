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

import { Box, InputBase } from '@material-ui/core';
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
import { SelectLabel } from '../components';
import Balance from './Balance';

interface Props {
  setError: (value: string) => void;
}

const useStyles = makeStyles((theme) => ({
  accountMain: {
    padding: theme.spacing(1.25),
    paddingTop: theme.spacing(0.5),
    paddingRight: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1.5),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    '& input': {
      color: theme.palette.text.secondary
    }
  },
  address: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: '100%',
    overflow: 'auto'
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
      setError('Invalid address');
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
    <div className={classes.accountMain}>
      <SelectLabel>Receiver</SelectLabel>
      <Box display="flex" alignItems="center">
        <AccountIdenticon address={addressInput} formatFound={formatFound} />
        <InputBase
          id="test-receiver-input"
          className={classes.address}
          fullWidth
          onChange={onChange}
          value={addressInput}
          placeholder="Recipient address"
        />
        {showBalance && state && <Balance balance={state.formattedBalance} />}
      </Box>
    </div>
  );
}

export default ReceiverInput;
