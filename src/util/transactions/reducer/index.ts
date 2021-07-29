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

import { INCORRECT_FORMAT, GENERIC } from '../../../constants';
import { ChainState } from '../../../types/sourceTargetTypes';
import { TransactionState, TransactionTypes, Payload, ReceiverPayload } from '../../../types/transactionTypes';

import getReceiverAddress from '../../getReceiverAddress';
import logger from '../../logger';

const validateAccount = (receiver: string, sourceChainDetails: ChainState, targetChainDetails: ChainState) => {
  try {
    if (!receiver) {
      return { formatFound: null, receiverAddress: null };
    }
    const { address, formatFound } = getReceiverAddress({
      targetChainDetails,
      sourceChainDetails,
      receiverAddress: receiver
    });

    return { formatFound, receiverAddress: address };
  } catch (e) {
    logger.error(e.message);
    if (e.message === INCORRECT_FORMAT) {
      return { formatFound: e.message, receiverAddress: receiver };
    }
  }
};

const shouldCalculatePayloadFee = (state: TransactionState, payload: Payload) => {
  const nextState = { ...state, ...payload };
  const {
    transferAmount,
    receiverAddress,
    weightInput,
    customCallInput,
    remarkInput,
    customCallError,
    senderAccount,
    action
  } = nextState;
  switch (action) {
    case TransactionTypes.TRANSFER: {
      return Boolean(transferAmount && receiverAddress && senderAccount);
    }
    case TransactionTypes.CUSTOM: {
      return Boolean(weightInput && customCallInput && senderAccount) && !customCallError;
    }
    case TransactionTypes.REMARK: {
      return Boolean(remarkInput && senderAccount);
    }
    default:
      return false;
  }
};

const updateTransaction = (state: TransactionState, payload: Payload): TransactionState => {
  if (state.transactions) {
    const newState = { ...state };
    const { updatedValues, id } = payload;
    newState.transactions = newState.transactions.map((stateTransaction) => {
      const { id: transactionId } = stateTransaction;
      if (transactionId === id) {
        return {
          ...stateTransaction,
          ...updatedValues
        };
      }
      return stateTransaction;
    });
    return newState;
  }
  return state;
};

const isInputReady = (state: TransactionState): boolean => {
  switch (state.action) {
    case TransactionTypes.TRANSFER: {
      return Boolean(state.transferAmount) && Boolean(state.receiverAddress);
    }
    case TransactionTypes.CUSTOM: {
      return Boolean(state.weightInput && state.customCallInput);
    }
    case TransactionTypes.REMARK: {
      return Boolean(state.remarkInput);
    }
    default:
      return false;
  }
};

const isReadyToExecute = (state: TransactionState): boolean => {
  const { transactionRunning, senderAccount } = state;
  const inputReady = isInputReady(state);
  return Boolean(!transactionRunning && inputReady && senderAccount);
};

const setReceiver = (state: TransactionState, payload: ReceiverPayload): TransactionState => {
  const { unformattedReceiverAddress, sourceChainDetails, targetChainDetails } = payload;
  const transactionReadyToExecute = isReadyToExecute({ ...state, ...payload });
  if (!unformattedReceiverAddress) {
    return {
      ...state,
      addressValidationError: null,
      showBalance: false,
      unformattedReceiverAddress,
      receiverAddress: null,
      genericReceiverAccount: null,
      formatFound: null,
      transactionReadyToExecute: false,
      payloadEstimatedFeeLoading: false,
      shouldEvaluatePayloadEstimatedFee: false,
      estimatedFee: null
    };
  }

  const { receiverAddress, formatFound } = validateAccount(
    unformattedReceiverAddress,
    sourceChainDetails,
    targetChainDetails
  )!;

  const { chain: targetChain } = targetChainDetails;
  const { chain: sourceChain } = sourceChainDetails;

  const shouldEvaluatePayloadEstimatedFee = shouldCalculatePayloadFee(state, { receiverAddress });

  if (formatFound === INCORRECT_FORMAT) {
    return {
      ...state,
      addressValidationError: 'Invalid address',
      showBalance: false,
      unformattedReceiverAddress,
      receiverAddress: null,
      genericReceiverAccount: null,
      formatFound,
      transactionReadyToExecute: false,
      shouldEvaluatePayloadEstimatedFee: false,
      estimatedFee: null
    };
  }

  if (formatFound === GENERIC) {
    return {
      ...state,
      unformattedReceiverAddress,
      receiverAddress: null,
      genericReceiverAccount: unformattedReceiverAddress,
      addressValidationError: null,
      showBalance: false,
      formatFound,
      transactionReadyToExecute: false,
      shouldEvaluatePayloadEstimatedFee: false,
      estimatedFee: null
    };
  }

  if (formatFound === targetChain) {
    return {
      ...state,
      unformattedReceiverAddress,
      receiverAddress,
      genericReceiverAccount: null,
      addressValidationError: null,
      showBalance: true,
      formatFound,
      transactionReadyToExecute,
      shouldEvaluatePayloadEstimatedFee
    };
  }

  if (formatFound === sourceChain) {
    return {
      ...state,
      unformattedReceiverAddress,
      receiverAddress: unformattedReceiverAddress,
      derivedReceiverAccount: receiverAddress,
      genericReceiverAccount: null,
      addressValidationError: null,
      showBalance: true,
      formatFound,
      transactionReadyToExecute,
      shouldEvaluatePayloadEstimatedFee
    };
  }

  return {
    ...state,
    addressValidationError: `Unsupported address SS58 prefix: ${formatFound}`,
    showBalance: false,
    unformattedReceiverAddress,
    receiverAddress: null,
    genericReceiverAccount: null,
    formatFound,
    transactionReadyToExecute: false,
    shouldEvaluatePayloadEstimatedFee: false
  };
};

export { updateTransaction, isReadyToExecute, setReceiver, shouldCalculatePayloadFee };
