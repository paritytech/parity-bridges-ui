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

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useTransactionContext } from '../contexts/TransactionContext';
import { useConnectedReceiver } from '../hooks';
import { useLoadingApi, useSendMessage } from '../hooks';
import { TransactionTypes } from '../types/transactionTypes';

interface Props {
  className?: string;
}

const Transfer = ({ className }: Props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [transferInput, setTransferInput] = useState('0');
  const [receiverInput, setReceiverInput] = useState('');

  const [receiverMessage, setReceiverMessage] = useState<string | null>();
  const setConnectedReceiver = useConnectedReceiver();
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

  const onReceiverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const receiver = event.target.value;
    setReceiverInput(receiver);
    setConnectedReceiver({
      receiver,
      setReceiverMessage
    });
  };

  if (!areApiReady) {
    return null;
  }

  // TO-DO: Remove <br /> by proper margins

  return (
    <>
      <h2>Transfer</h2>
      <Container className={className}>
        <div className="receiver">
          <TextField fullWidth onChange={onReceiverChange} value={receiverInput} label="Receiver" variant="outlined" />
        </div>
        <p>{receiverMessage && `${receiverMessage}`}</p>

        <br />
        <TextField onChange={onChange} value={transferInput} label="Sender" variant="outlined" />

        <br />
        <Button variant="contained" disabled={isButtonDisabled()} onClick={sendLaneMessage}>
          Send Transfer
        </Button>
        <p>{receiverAddress && estimatedFee && `Estimated source Fee: ${estimatedFee}`}</p>
      </Container>
    </>
  );
};

export default styled(Transfer)`
  margin: 40px 0;
  .receiver {
    max-width: 700px;
  }
`;
