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

import React, { useEffect, useCallback } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import { TransactionActionCreators } from '../actions/transactionActions';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import useSendMessage from '../hooks/chain/useSendMessage';
import { TransactionTypes } from '../types/transactionTypes';
import { TokenSymbol } from './TokenSymbol';
import Receiver from './Receiver';
import { ButtonSubmit } from '../components';
import { EstimatedFee } from '../components/EstimatedFee';
import { DebouncedTextField } from './DebouncedTextField';
import { useInternalTransfer } from '../hooks/chain/useInternalTransfer';
import { useGUIContext } from '../contexts/GUIContextProvider';
import FeePaySelector from './FeePaySelector';

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
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  const { isBridged } = useGUIContext();
  const {
    transferAmount,
    transferAmountError,
    transactionRunning,
    transactionReadyToExecute
  } = useTransactionContext();
  const { api } = sourceChainDetails.apiConnection;
  const executeInternalTransfer = useInternalTransfer();

  const dispatchCallback = useCallback(
    (value: string | null) => {
      dispatchTransaction(
        TransactionActionCreators.setTransferAmount(
          value !== null ? value?.toString() : '',
          api.registry.chainDecimals[0]
        )
      );
    },
    [api.registry.chainDecimals, dispatchTransaction]
  );

  const sendLaneMessage = useSendMessage({
    input: transferAmount?.toString() ?? '',
    type: TransactionTypes.TRANSFER
  });

  const sendTransaction = useCallback(() => {
    if (!isBridged) {
      executeInternalTransfer();
      return;
    }
    sendLaneMessage();
  }, [executeInternalTransfer, isBridged, sendLaneMessage]);

  useEffect((): void => {
    transactionRunning && transferAmount && dispatchCallback('');
  }, [dispatchCallback, transactionRunning, transferAmount]);

  const buttonLabel = isBridged
    ? `Send bridge transfer from ${sourceChainDetails.chain} to ${targetChainDetails.chain}`
    : `Send internal transfer to ${sourceChainDetails.chain}`;

  return (
    <>
      <Box mb={2}>
        <DebouncedTextField
          id="test-amount-send"
          dispatchCallback={dispatchCallback}
          placeholder={'0'}
          classes={classes.inputAmount}
          fullWidth
          variant="outlined"
          helperText={transferAmountError || ''}
          InputProps={{
            endAdornment: <TokenSymbol position="start" />
          }}
        />
      </Box>
      <Receiver />
      <ButtonSubmit disabled={!transactionReadyToExecute} onClick={sendTransaction}>
        {buttonLabel}
      </ButtonSubmit>
      <FeePaySelector />
      <EstimatedFee />
    </>
  );
}

export default Transfer;
