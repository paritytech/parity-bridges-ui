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

import { TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { ButtonSubmit } from '../components';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useLoadingApi from '../hooks/useLoadingApi';
import useSendMessage from '../hooks/useSendMessage';
import { TransactionTypes } from '../types/transactionTypes';

const Remark = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [remarkInput, setRemarkInput] = useState('0x');
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();

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

  return (
    <>
      <TextField onChange={onChange} value={remarkInput} variant="outlined" fullWidth />
      <ButtonSubmit disabled={isButtonDisabled()} onClick={sendLaneMessage}>
        Send bridge remark from {sourceChainDetails.sourceChain} to {targetChainDetails.targetChain}
      </ButtonSubmit>
      <p>{estimatedFee && `Estimated source Fee: ${estimatedFee}`}</p>
    </>
  );
};

export default Remark;
