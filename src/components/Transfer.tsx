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

import AccountActions from '../actions/accountActions';
import { useAccountContext, useUpdateAccountContext } from '../contexts/AccountContextProvider';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useLoadingApi from '../hooks/useLoadingApi';
import useSendMessage from '../hooks/useSendMessage';
import useTransactionPreparation from '../hooks/useTransactionPreparation';
import { TransactionTypes } from '../types/transactionTypes';
import getReceiverAddress from '../util/getReceiverAddress';

interface Props {
  className?: string;
}

const Transfer = ({ className }: Props) => {
  const { targetChain } = useSourceTarget();

  const [isRunning, setIsRunning] = useState(false);
  const areApiReady = useLoadingApi();
  const [transferInput, setTransferInput] = useState('0');
  const [receiver, setReceiver] = useState<string>('');
  const [receiverMessage, setReceiverMessage] = useState<string | null>();

  const [executionStatus, setExecutionStatus] = useState('');
  const { account: currentAccount, receiverAddress } = useAccountContext();
  const { dispatchAccount } = useUpdateAccountContext();
  const { payload } = useTransactionPreparation({ input: transferInput, type: TransactionTypes.TRANSFER });
  const { estimatedFee } = useTransactionContext();
  const message = {
    error: 'Error sending transfer',
    successfull: 'Transfer was executed succesfully'
  };
  const sendLaneMessage = useSendMessage({
    input: transferInput,
    isRunning,
    message,
    payload,
    setExecutionStatus,
    setIsRunning
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExecutionStatus('');
    setTransferInput(event.target.value);
  };

  const onReceiverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiverMessage('');
    setReceiver(event.target.value);
  };

  if (!areApiReady) {
    return null;
  }

  const onEnter = (e: any) => {
    if (e.key === 'Enter') {
      setReceiverMessage('');
      try {
        const receiverAddress = getReceiverAddress({ chain: targetChain, receiverAddress: receiver });
        if (receiverAddress !== receiver) {
          setReceiverMessage(`The format for the account is incorrect, funds will be sent to ${receiverAddress}`);
        }
        dispatchAccount({ payload: { receiverAddress }, type: AccountActions.SET_RECEIVER_ADDRESS });
      } catch (e) {
        console.log('e', e);
        if (e.message === 'INCORRECT-FORMAT') {
          setReceiverMessage('Invalid address, please provide a valid address');
        }
      }
    }
  };

  return (
    <Container className={className}>
      <Grid.Row>
        <Grid.Column>
          <label>Sender</label>
          <Input onChange={onChange} value={transferInput} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <label>Receiver</label>
          <Input fluid onChange={onReceiverChange} onKeyDown={onEnter} value={receiver} />
          {receiverMessage && <p>{receiverMessage}</p>}
          <Button disabled={isRunning || !receiverAddress || !currentAccount} onClick={sendLaneMessage}>
            Send Transfer
          </Button>
          {receiverAddress && estimatedFee && <p>Estimated source Fee: {estimatedFee}</p>}
        </Grid.Column>
      </Grid.Row>

      {executionStatus !== '' && (
        <div className="status">
          <p>{executionStatus}</p>
        </div>
      )}
    </Container>
  );
};

export default styled(Transfer)``;
