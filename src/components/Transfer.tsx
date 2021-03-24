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

import React, { useState } from 'react';
import { Button, Container, Grid, Input } from 'semantic-ui-react';
import styled from 'styled-components';

import { useTransactionContext } from '../contexts/TransactionContext';
import useConnectedReceiver from '../hooks/useConnectedReceiver';
import useLoadingApi from '../hooks/useLoadingApi';
import useSendMessage from '../hooks/useSendMessage';
import { TransactionTypes } from '../types/transactionTypes';

interface Props {
  className?: string;
}

const Transfer = ({ className }: Props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [transferInput, setTransferInput] = useState('0');
  const [receiverInput, setReceiverInput] = useState('');

  const [receiverMessage, setReceiverMessage] = useState<string | null>();
  const [executionStatus, setExecutionStatus] = useState('');
  const setConnectedReceiver = useConnectedReceiver();
  const areApiReady = useLoadingApi();

  const { estimatedFee, receiverAddress } = useTransactionContext();
  const message = {
    error: 'Error sending transfer',
    successfull: 'Transfer was executed succesfully'
  };
  const { isButtonDisabled, sendLaneMessage } = useSendMessage({
    input: transferInput,
    isRunning,
    message,
    setExecutionStatus,
    setIsRunning,
    type: TransactionTypes.TRANSFER
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExecutionStatus('');
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

  console.log('isButtonDisabled', isButtonDisabled());

  return (
    <Container className={className}>
      <Grid.Row>
        <Grid.Column>
          <label>Receiver</label>
          <Input fluid onChange={onReceiverChange} value={receiverInput} />
          <p>{receiverMessage && `${receiverMessage}`}</p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <label>Sender</label>
          <Input onChange={onChange} value={transferInput} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Button disabled={isButtonDisabled()} onClick={sendLaneMessage}>
            Send Transfer
          </Button>
          <p>{receiverAddress && estimatedFee && `Estimated source Fee: ${estimatedFee}`}</p>
        </Grid.Column>
      </Grid.Row>
      <div className="status">
        <p>{executionStatus !== '' && executionStatus}</p>
      </div>
    </Container>
  );
};

export default styled(Transfer)``;
