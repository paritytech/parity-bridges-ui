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

export default function useEvaluateCalculation(transactionState: TransactionState) {
  const [shouldEvaluate, setShouldEvaluate] = useState(false);

  const {
    receiverAddress,
    transferAmount,
    remarkInput,
    customCallInput,
    customCallError,
    weightInput,
    senderAccount,
    payloadEstimatedFeeLoading
  } = transactionState;

  const prevReceiverAddress = usePrevious(receiverAddress);
  const prevTransferAmount = usePrevious(transferAmount);
  const prevRemarkInput = usePrevious(remarkInput);
  const prevCustomCallInput = usePrevious(customCallInput);
  const prevWeightInput = usePrevious(weightInput);
  const prevSenderAccount = usePrevious(senderAccount);

  const { action } = useGUIContext();

  useEffect(() => {
    const evaluateInputs = () => {
      switch (action) {
        case TransactionTypes.TRANSFER: {
          return (
            Boolean(transferAmount && receiverAddress) &&
            (prevTransferAmount !== transferAmount || prevReceiverAddress !== receiverAddress)
          );
        }
        case TransactionTypes.CUSTOM: {
          return (
            Boolean(weightInput && customCallInput) &&
            !customCallError &&
            (prevWeightInput !== weightInput || prevCustomCallInput !== customCallInput)
          );
        }
        case TransactionTypes.REMARK: {
          return Boolean(remarkInput) && prevRemarkInput !== remarkInput;
        }
        default:
          return false;
      }
    };

    const inputChanged = evaluateInputs();
    setShouldEvaluate(prevSenderAccount !== senderAccount || inputChanged);
  }, [
    action,
    customCallError,
    customCallInput,
    remarkInput,
    transferAmount,
    weightInput,
    payloadEstimatedFeeLoading,
    prevCustomCallInput,
    prevReceiverAddress,
    prevRemarkInput,
    prevSenderAccount,
    prevTransferAmount,
    prevWeightInput,
    receiverAddress,
    senderAccount
  ]);

  return shouldEvaluate;
}
