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

import { Button, Container, TextField } from '@material-ui/core';
import React, { useState } from 'react';

import { useTransactionContext } from '../contexts/TransactionContext';
import useLoadingApi from '../hooks/useLoadingApi';
import { makeStyles } from '@material-ui/core/styles';
import useSendMessage from '../hooks/useSendMessage';
import { TransactionTypes } from '../types/transactionTypes';

import Receiver from './Receiver';

const useStyles = makeStyles(() => ({
  container: {
    width: '700px',
    marginLeft: '0'
  }
}));

const Transfer = () => {
  const classes = useStyles();
  const [isRunning, setIsRunning] = useState(false);
  const [transferInput, setTransferInput] = useState('0');

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

  if (!areApiReady) {
    return null;
  }

  return (
    <Container className={classes.container}>
      <h2>Transfer</h2>

      <Receiver />

      <TextField onChange={onChange} value={transferInput} label="Amount" variant="outlined" />

      <Button variant="contained" disabled={isButtonDisabled()} onClick={sendLaneMessage}>
        Send Bridge Message
      </Button>

      <p>{receiverAddress && estimatedFee && `Estimated source Fee: ${estimatedFee}`}</p>
    </Container>
  );
};

export default Transfer;
