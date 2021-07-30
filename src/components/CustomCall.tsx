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

import React, { useCallback } from 'react';
import { Box } from '@material-ui/core';
import { ButtonSubmit } from '../components';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useSendMessage from '../hooks/chain/useSendMessage';
import useApiCalls from '../hooks/api/useApiCalls';
import { TransactionTypes } from '../types/transactionTypes';
import { EstimatedFee } from './EstimatedFee';
import { TransactionActionCreators } from '../actions/transactionActions';
import { useTransactionContext, useUpdateTransactionContext } from '../contexts/TransactionContext';
import { DebouncedTextField } from './DebouncedTextField';

const initialValue = '0x';

const CustomCall = () => {
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { customCallInput, weightInput, transactionReadyToExecute, customCallError } = useTransactionContext();

  const { sourceChainDetails, targetChainDetails } = useSourceTarget();

  const {
    targetChainDetails: { chain: targetChain }
  } = useSourceTarget();
  const { createType } = useApiCalls();

  const sendLaneMessage = useSendMessage({
    input: customCallInput,
    type: TransactionTypes.CUSTOM,
    weightInput
  });

  const onChange = useCallback(
    (value: string | null) => {
      dispatchTransaction(TransactionActionCreators.setCustomCallInput(value, createType, targetChain));
    },
    [createType, dispatchTransaction, targetChain]
  );

  const onWeightChange = useCallback(
    (value: string | null) => {
      dispatchTransaction(TransactionActionCreators.setWeightInput(value));
    },
    [dispatchTransaction]
  );

  return (
    <>
      <Box mb={2}>
        <DebouncedTextField
          dispatchCallback={onChange}
          placeholder={initialValue}
          label="Call"
          variant="outlined"
          fullWidth
          helperText={customCallError && `${customCallError}`}
        />
      </Box>
      <DebouncedTextField dispatchCallback={onWeightChange} label="Weight" variant="outlined" fullWidth />
      <ButtonSubmit disabled={!transactionReadyToExecute} onClick={sendLaneMessage}>
        Send custom call from {sourceChainDetails.chain} to {targetChainDetails.chain}
      </ButtonSubmit>
      <EstimatedFee />
    </>
  );
};

export default CustomCall;
