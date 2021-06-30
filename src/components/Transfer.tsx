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

import React, { useEffect, useState } from 'react';
import { Box, makeStyles, TextField, Typography } from '@material-ui/core';
import BN from 'bn.js';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import { TransactionActionCreators } from '../actions/transactionActions';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';

import useAccounts from '../hooks/accounts/useAccounts';
import useBalance from '../hooks/subscriptions/useBalance';
import useSendMessage from '../hooks/chain/useSendMessage';
import { TransactionTypes } from '../types/transactionTypes';
import { TokenSymbol } from './TokenSymbol';
import Receiver from './Receiver';
import { evalUnits } from '../util/evalUnits';
import { Alert, ButtonSubmit } from '../components';

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
    }
  }
}));

function Transfer() {
  const { dispatchTransaction } = useUpdateTransactionContext();
  const classes = useStyles();
  const [input, setInput] = useState<string>('0');
  const [isRunning, setIsRunning] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [amountNotCorrect, setAmountNotCorrect] = useState<boolean>(false);
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  const { account } = useAccounts();

  const { estimatedFee, transferAmount, receiverAddress, estimatedFeeLoading } = useTransactionContext();
  const { api, isApiReady } = sourceChainDetails.apiConnection;
  const balance = useBalance(api, account?.address || '');

  const { isButtonDisabled, sendLaneMessage } = useSendMessage({
    input: transferAmount ?? '',
    isRunning,
    setIsRunning,
    type: TransactionTypes.TRANSFER
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    const [actualValue, message] = evalUnits(event.target.value);
    setHelperText(message);
    dispatchTransaction(
      TransactionActionCreators.setTransferAmount(null, actualValue !== null ? actualValue?.toString() : '')
    );
  };

  useEffect((): void => {
    isRunning && dispatchTransaction(TransactionActionCreators.setTransferAmount(null, ''));
  }, [dispatchTransaction, isRunning]);

  // To extract estimated fee logic to specific component. Issue #171
  useEffect((): void => {
    estimatedFee &&
      transferAmount &&
      setAmountNotCorrect(new BN(balance.free).sub(new BN(transferAmount).add(new BN(estimatedFee))).isNeg());
  }, [transferAmount, estimatedFee, balance, isApiReady]);

  return (
    <>
      <Box mb={2}>
        <TextField
          id="test-amount-send"
          onChange={onChange}
          value={input}
          placeholder={'0'}
          className={classes.inputAmount}
          fullWidth
          variant="outlined"
          helperText={helperText}
          InputProps={{
            endAdornment: <TokenSymbol position="start" />
          }}
        />
      </Box>
      <Receiver />
      <ButtonSubmit disabled={isButtonDisabled() || amountNotCorrect} onClick={sendLaneMessage}>
        Send bridge transfer from {sourceChainDetails.chain} to {targetChainDetails.chain}
      </ButtonSubmit>
      {amountNotCorrect ? (
        <Alert severity="error">
          Account&apos;s amount (including fees: {estimatedFee}) is not enough for this transaction.
        </Alert>
      ) : estimatedFeeLoading ? (
        <Typography variant="body1" color="secondary">
          Estimated source Fee loading...
        </Typography>
      ) : (
        <Typography variant="body1" color="secondary">
          {receiverAddress && estimatedFee && `Estimated source Fee: ${estimatedFee}`}
        </Typography>
      )}
    </>
  );
}

export default Transfer;
