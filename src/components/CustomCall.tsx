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

import { Box, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { ButtonSubmit } from '../components';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useSendMessage from '../hooks/chain/useSendMessage';
import useApiCalls from '../hooks/api/useApiCalls';
import { TransactionTypes } from '../types/transactionTypes';

const CustomCall = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [decoded, setDecoded] = useState<string | null>();

  const [customCallInput, setCustomCallInput] = useState('0x');
  const [weightInput, setWeightInput] = useState<string>();
  const [error, setError] = useState<string | null>();
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();

  const { estimatedFee, estimatedFeeLoading } = useTransactionContext();
  const {
    targetChainDetails: { chain: targetChain }
  } = useSourceTarget();
  const { createType } = useApiCalls();

  const { isButtonDisabled, sendLaneMessage } = useSendMessage({
    input: customCallInput,
    isRunning,
    isValidCall: Boolean(decoded),
    setIsRunning,
    type: TransactionTypes.CUSTOM,
    weightInput
  });
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    decodePayload(event.target.value);
    setCustomCallInput(event.target.value);
  };

  const onWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeightInput(event.target.value);
  };

  function decodePayload(input: string) {
    try {
      setError(null);

      //@ts-ignore
      const call = createType(targetChain, 'Call', input);
      setDecoded(JSON.stringify(call, null, 4));
    } catch (e) {
      setError('Wrong call provided');
      setDecoded(null);
    }
  }

  // To extract estimated fee logic to specific component. Issue #171
  return (
    <>
      <Box mb={2}>
        <TextField
          onChange={onChange}
          value={customCallInput}
          label="Call"
          variant="outlined"
          fullWidth
          helperText={error && `${error}`}
        />
      </Box>
      <TextField onChange={onWeightChange} value={weightInput} label="Weight" variant="outlined" fullWidth />
      <ButtonSubmit disabled={isButtonDisabled()} onClick={sendLaneMessage}>
        Send custom call from {sourceChainDetails.chain} to {targetChainDetails.chain}
      </ButtonSubmit>
      {estimatedFeeLoading ? (
        <Typography variant="body1" color="secondary">
          Estimated source Fee loading...
        </Typography>
      ) : (
        <Typography variant="body1" color="secondary">
          {estimatedFee && `Estimated source Fee: ${estimatedFee}`}
        </Typography>
      )}
    </>
  );
};

export default CustomCall;
