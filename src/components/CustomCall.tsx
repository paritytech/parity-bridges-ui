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

import type { InterfaceTypes } from '@polkadot/types/types';

import React, { useState, useCallback } from 'react';
import { Box, TextField } from '@material-ui/core';
import { ButtonSubmit } from '../components';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useSendMessage from '../hooks/chain/useSendMessage';
import useApiCalls from '../hooks/api/useApiCalls';
import { TransactionTypes } from '../types/transactionTypes';
import { EstimatedFee } from './EstimatedFee';
import useDebounceState from '../hooks/react/useDebounceState';
import { TransactionActionCreators } from '../actions/transactionActions';
import { useTransactionContext, useUpdateTransactionContext } from '../contexts/TransactionContext';
import logger from '../util/logger';

const initialValue = '0x';

const CustomCall = () => {
  const [decoded, setDecoded] = useState<string | null>(null);
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { customCallInput, weightInput, transactionReadyToExecute } = useTransactionContext();

  const dispatchCallbackCustomCall = useCallback(
    (value: string | null) => {
      dispatchTransaction(TransactionActionCreators.setCustomCallInput(value));
    },
    [dispatchTransaction]
  );

  const [currentCustomCallInput, setCustomCallInput] = useDebounceState({
    initialValue,
    dispatchCallback: dispatchCallbackCustomCall
  });

  const dispatchCallbackWeight = useCallback(
    (value: string) => {
      dispatchTransaction(TransactionActionCreators.setWeightInput(decoded ? value : null));
    },
    [decoded, dispatchTransaction]
  );

  const [currentWeightInput, setWeightInput] = useDebounceState({
    initialValue: '',
    dispatchCallback: dispatchCallbackWeight
  });

  const [error, setError] = useState<string | null>();
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
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      try {
        setError(null);
        setCustomCallInput(input);
        const call = createType(targetChain as keyof InterfaceTypes, 'Call', input);
        setDecoded(JSON.stringify(call, null, 4));
      } catch (e) {
        logger.error('Wrong call', e);
        setError('Wrong call provided');
        setDecoded(null);
      }
    },
    [createType, setCustomCallInput, targetChain]
  );

  const onWeightChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setWeightInput(event.target.value);
    },
    [setWeightInput]
  );

  return (
    <>
      <Box mb={2}>
        <TextField
          onChange={onChange}
          value={currentCustomCallInput}
          placeholder={initialValue}
          label="Call"
          variant="outlined"
          fullWidth
          helperText={error && `${error}`}
        />
      </Box>
      <TextField onChange={onWeightChange} value={currentWeightInput} label="Weight" variant="outlined" fullWidth />
      <ButtonSubmit disabled={!transactionReadyToExecute} onClick={sendLaneMessage}>
        Send custom call from {sourceChainDetails.chain} to {targetChainDetails.chain}
      </ButtonSubmit>
      <EstimatedFee />
    </>
  );
};

export default CustomCall;
