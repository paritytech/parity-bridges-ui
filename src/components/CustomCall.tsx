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
import { Button, Container, Input } from 'semantic-ui-react';
import { Message } from 'semantic-ui-react';
import styled from 'styled-components';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useLoadingApi from '../hooks/useLoadingApi';
import useSendMessage from '../hooks/useSendMessage';
import { TransactionTypes } from '../types/transactionTypes';
interface Props {
  className?: string;
}

const CustomCall = ({ className }: Props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [decoded, setDecoded] = useState<string | null>();

  const [customCallInput, setCustomCallInput] = useState('0x');
  const [weightInput, setWeightInput] = useState<string>();
  const [error, setError] = useState<string | null>();

  const areApiReady = useLoadingApi();
  const { estimatedFee } = useTransactionContext();
  const {
    targetChainDetails: {
      targetApiConnection: { api: targetApi }
    }
  } = useSourceTarget();

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

  if (!areApiReady) {
    return null;
  }

  function decodePayload(input: string) {
    try {
      setError(null);
      const call = targetApi.createType('Call', input);
      setDecoded(JSON.stringify(call, null, 4));
    } catch (e) {
      setError('Wrong call provided.');
      setDecoded(null);
    }
  }

  return (
    <>
      <h2>Custom Call</h2>
      <Container className={className}>
        <div>
          <p>Call</p>
          <Input onChange={onChange} value={customCallInput} />
          <p>{error && `${error}`}</p>
        </div>
        <br />
        <div>
          <p>Weight</p>
          <Input onChange={onWeightChange} value={weightInput} />

          <Button disabled={isButtonDisabled()} onClick={sendLaneMessage}>
            Send CustomCall
          </Button>
        </div>
      </Container>
      <p>{estimatedFee && `Estimated source Fee: ${estimatedFee}`}</p>
      <div>
        {decoded && (
          <Message>
            <Message.Header>Decoded call</Message.Header>
            <p>
              <pre>{decoded}</pre>
            </p>
          </Message>
        )}
      </div>
    </>
  );
};

export default styled(CustomCall)`
  display: flex !important;
  justify-content: start !important;
`;
