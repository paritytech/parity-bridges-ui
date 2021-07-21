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

import React, { useState, useEffect, useCallback } from 'react';
import { Box, makeStyles, TextField } from '@material-ui/core';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import { useAccountContext } from '../contexts/AccountContextProvider';
import { TransactionActionCreators } from '../actions/transactionActions';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import useBalance from '../hooks/subscriptions/useBalance';
import useSendMessage from '../hooks/chain/useSendMessage';
import { TransactionTypes } from '../types/transactionTypes';
import { TokenSymbol } from './TokenSymbol';
import Receiver from './Receiver';
import { Alert, ButtonSubmit } from '../components';
import { EstimatedFee } from '../components/EstimatedFee';
import useDebounceState from '../hooks/react/useDebounceState';
import BN from 'bn.js';

const useStyles = makeStyles((theme) => ({
  inputAmount: {
    '& .MuiInputBase-root': {
      '& .MuiInputAdornment-root': {
        position: 'absolute',
        right: theme.spacing(2),
        ...theme.typography.subtitle2
      },
      '& input': {
        textAlign: 'center',
        ...theme.typography.subtitle2,
        fontSize: theme.typography.h1.fontSize,
        color: theme.palette.primary.main
      }
    },
    minHeight: '95px'
  }
}));

function Transfer() {
  const { dispatchTransaction } = useUpdateTransactionContext();
  const classes = useStyles();
  const [amountNotCorrect, setAmountNotCorrect] = useState<boolean>(false);
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  const { account } = useAccountContext();
  const {
    estimatedFee,
    transferAmount,
    transferAmountError,
    transactionRunning,
    transactionReadyToExecute
  } = useTransactionContext();
  const { api } = sourceChainDetails.apiConnection;
  const balance = useBalance(api, account?.address || '');

  const dispatchCallback = useCallback(
    (value: string) => {
      dispatchTransaction(
        TransactionActionCreators.setTransferAmount(
          value !== null ? value?.toString() : '',
          api.registry.chainDecimals[0]
        )
      );
    },
    [api.registry.chainDecimals, dispatchTransaction]
  );

  const [currentInput, setInput] = useDebounceState({ initialValue: '0', dispatchCallback });

  const sendLaneMessage = useSendMessage({
    input: transferAmount?.toString() ?? '',
    type: TransactionTypes.TRANSFER
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  useEffect((): void => {
    transactionRunning && setInput('');
  }, [setInput, transactionRunning]);

  useEffect((): void => {
    estimatedFee &&
      transferAmount &&
      setAmountNotCorrect(new BN(balance.free).sub(transferAmount).add(new BN(estimatedFee)).isNeg());
  }, [transferAmount, estimatedFee, balance]);

  return (
    <>
      <Box mb={2}>
        <TextField
          id="test-amount-send"
          onChange={onChange}
          value={currentInput}
          placeholder={'0'}
          className={classes.inputAmount}
          fullWidth
          variant="outlined"
          autoComplete="off"
          helperText={transferAmountError || ''}
          InputProps={{
            endAdornment: <TokenSymbol position="start" />
          }}
        />
      </Box>
      <Receiver />
      <ButtonSubmit disabled={!transactionReadyToExecute || amountNotCorrect} onClick={sendLaneMessage}>
        Send bridge transfer from {sourceChainDetails.chain} to {targetChainDetails.chain}
      </ButtonSubmit>
      {amountNotCorrect ? (
        <Alert severity="error">
          Account&apos;s amount (including fees: {estimatedFee}) is not enough for this transaction.
        </Alert>
      ) : (
        <EstimatedFee />
      )}
    </>
  );
}

export default Transfer;
