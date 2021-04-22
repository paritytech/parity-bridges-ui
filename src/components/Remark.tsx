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
import styled from 'styled-components';

import { useTransactionContext } from '../contexts/TransactionContext';
import { useLoadingApi, useSendMessage } from '../hooks';
import { TransactionTypes } from '../types/transactionTypes';
interface Props {
  className?: string;
}

const Remark = ({ className }: Props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [remarkInput, setRemarkInput] = useState('0x');
  const areApiReady = useLoadingApi();
  const { estimatedFee } = useTransactionContext();

  const { isButtonDisabled, sendLaneMessage } = useSendMessage({
    input: remarkInput,
    isRunning,
    setIsRunning,
    type: TransactionTypes.REMARK
  });
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarkInput(event.target.value);
  };

  if (!areApiReady) {
    return null;
  }

  // TO-DO: Remove <br /> by proper margins
  return (
    <>
      <h2>Remark</h2>
      <Container className={className}>
        <TextField onChange={onChange} value={remarkInput} variant="outlined" />
        <Button variant="contained" disabled={isButtonDisabled()} onClick={sendLaneMessage}>
          Send Remark
        </Button>
        <p>{estimatedFee && `Estimated source Fee: ${estimatedFee}`}</p>
      </Container>
    </>
  );
};

export default styled(Remark)`
  margin: 40px 0;
  display: flex !important;
  justify-content: start !important;
`;
