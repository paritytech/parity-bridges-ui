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

import { Box, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import BN from 'bn.js';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useAccounts from '../hooks/useAccounts';
import useBalance from '../hooks/useBalance';
import useLoadingApi from '../hooks/useLoadingApi';
import useSendMessage from '../hooks/useSendMessage';
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
        right: 0
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
  const classes = useStyles();
  const [isRunning, setIsRunning] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [transferInput, setTransferInput] = useState<string>('');
  const [actualInput, setActualInput] = useState<number | null>();
  const [amountNotCorrect, setAmountNotCorrect] = useState<boolean>(false);
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  const { account } = useAccounts();

  const areApiReady = useLoadingApi();
  const planck = 10 ** targetChainDetails.targetApiConnection.api.registry.chainDecimals[0];
  const { estimatedFee, receiverAddress } = useTransactionContext();
  const { api, isApiReady } = sourceChainDetails.sourceApiConnection;
  const balance = useBalance(api, account?.address || '');

  const { isButtonDisabled, sendLaneMessage } = useSendMessage({
    input: actualInput?.toString() ?? '',
    isRunning,
    setIsRunning,
    type: TransactionTypes.TRANSFER
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      const [actualValue, message] = evalUnits(event.target.value);
      setHelperText(message);
      setActualInput(actualValue && actualValue * planck);
    }
    setTransferInput(event.target.value);
  };

  useEffect((): void => {
    isRunning && setTransferInput('');
  }, [isRunning]);

  useEffect((): void => {
    estimatedFee &&
      setAmountNotCorrect(new BN(balance.free).sub(new BN(transferInput).add(new BN(estimatedFee))).toNumber() < 0);
  }, [transferInput, estimatedFee, balance, isApiReady]);

  if (!areApiReady) return null;

  return (
    <>
      <Box mb={2}>
        <TextField
          onChange={onChange}
          value={transferInput}
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
        Send bridge transfer from {sourceChainDetails.sourceChain} to {targetChainDetails.targetChain}
      </ButtonSubmit>
      {amountNotCorrect ? (
        <Alert severity="error">
          Account&apos;s amount (including fees: {estimatedFee}) is not enough for this transaction.
        </Alert>
      ) : (
        <Typography variant="body1" color="secondary">
          {receiverAddress && estimatedFee && `Estimated source Fee: ${estimatedFee}`}
        </Typography>
      )}
    </>
  );
}

export default Transfer;
