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

import { Box, InputAdornment, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useLoadingApi from '../hooks/useLoadingApi';
import useSendMessage from '../hooks/useSendMessage';
import { TransactionTypes } from '../types/transactionTypes';

import Receiver from './Receiver';
import { ButtonSubmit } from '../components';

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

const Transfer = () => {
  const classes = useStyles();
  const [isRunning, setIsRunning] = useState(false);
  const [transferInput, setTransferInput] = useState<string>('');
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();

  const areApiReady = useLoadingApi();

  const { estimatedFee, receiverAddress } = useTransactionContext();

  const { isButtonDisabled, sendLaneMessage } = useSendMessage({
    input: transferInput,
    isRunning,
    setIsRunning,
    type: TransactionTypes.TRANSFER
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransferInput(event.target.value);
  };

  if (!areApiReady) return null;

  return (
    <>
      <Box mb={2}>
        <TextField
          onChange={onChange}
          value={transferInput && transferInput}
          placeholder={'0'}
          className={classes.inputAmount}
          fullWidth
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                {targetChainDetails.targetApiConnection.api.registry.chainTokens}
              </InputAdornment>
            )
          }}
        />
      </Box>
      <Receiver />
      <ButtonSubmit disabled={isButtonDisabled()} onClick={sendLaneMessage}>
        Send bridge transfer from {sourceChainDetails.sourceChain} to {targetChainDetails.targetChain}
      </ButtonSubmit>
      {receiverAddress && estimatedFee && `Estimated source Fee: ${estimatedFee}`}
    </>
  );
};

export default Transfer;
