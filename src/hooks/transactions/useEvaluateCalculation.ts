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

import { useEffect, useState } from 'react';
import { TransactionState, TransactionTypes } from '../../types/transactionTypes';

import { useGUIContext } from '../../contexts/GUIContextProvider';
import usePrevious from '../react/usePrevious';
import useDebounceState from '../react/useDebounceState';

export default function useEvaluateCalculation(transactionState: TransactionState) {
  const [shouldEvaluate, setShouldEvaluate] = useState(false);

  const {
    receiverAddress,
    transferAmount,
    remarkInput,
    customCallInput,
    weightInput,
    senderAccount,
    payloadEstimatedFeeLoading
  } = transactionState;

  const debouncedTransferAmount = useDebounceState(transferAmount);
  const debouncedRemarkInput = useDebounceState(remarkInput);
  const debouncedCustomCall = useDebounceState(customCallInput);
  const debouncedWeightInput = useDebounceState(weightInput);

  const prevReceiverAddress = usePrevious(receiverAddress);
  const prevTransferAmount = usePrevious(debouncedTransferAmount);
  const prevRemarkInput = usePrevious(debouncedRemarkInput);
  const prevCustomCallInput = usePrevious(debouncedCustomCall);
  const prevWeightInput = usePrevious(debouncedWeightInput);
  const prevSenderAccount = usePrevious(senderAccount);

  const { action } = useGUIContext();

  useEffect(() => {
    const evaluateInputs = () => {
      switch (action) {
        case TransactionTypes.TRANSFER: {
          return (
            Boolean(debouncedTransferAmount && receiverAddress) &&
            (prevTransferAmount !== debouncedTransferAmount || prevReceiverAddress !== receiverAddress)
          );
        }
        case TransactionTypes.CUSTOM: {
          return (
            Boolean(debouncedWeightInput && debouncedCustomCall) &&
            (prevWeightInput !== debouncedWeightInput || prevCustomCallInput !== debouncedCustomCall)
          );
        }
        case TransactionTypes.REMARK: {
          return Boolean(debouncedRemarkInput) && prevRemarkInput !== debouncedRemarkInput;
        }
        default:
          return false;
      }
    };

    const inputChanged = evaluateInputs();
    setShouldEvaluate(prevSenderAccount !== senderAccount || inputChanged);
  }, [
    action,
    customCallInput,
    debouncedCustomCall,
    debouncedRemarkInput,
    debouncedTransferAmount,
    debouncedWeightInput,
    payloadEstimatedFeeLoading,
    prevCustomCallInput,
    prevReceiverAddress,
    prevRemarkInput,
    prevSenderAccount,
    prevTransferAmount,
    prevWeightInput,
    receiverAddress,
    remarkInput,
    senderAccount,
    transferAmount,
    weightInput
  ]);

  return shouldEvaluate;
}
