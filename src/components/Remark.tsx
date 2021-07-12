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

import { TextField, Typography } from '@material-ui/core';
import React from 'react';
import { ButtonSubmit } from '../components';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useSendMessage from '../hooks/chain/useSendMessage';
import { TransactionTypes } from '../types/transactionTypes';
import { EstimatedFee } from './EstimatedFee';
import useDebounceState from '../hooks/react/useDebounceState';

const initialValue = '0x';

const Remark = () => {
  const [currentInput, setRemarkInput, remarkDebouncedInput] = useDebounceState({ initialValue });
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();

  const { isButtonDisabled, sendLaneMessage } = useSendMessage({
    input: remarkDebouncedInput,
    type: TransactionTypes.REMARK
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarkInput(event.target.value);
  };

  // To extract estimated fee logic to specific component. Issue #171
  return (
    <>
      <TextField
        label="Remark"
        value={currentInput}
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        onChange={onChange}
      />
      <ButtonSubmit disabled={isButtonDisabled()} onClick={sendLaneMessage}>
        Send bridge remark from {sourceChainDetails.chain} to {targetChainDetails.chain}
      </ButtonSubmit>
      <EstimatedFee />
    </>
  );
};

export default Remark;
