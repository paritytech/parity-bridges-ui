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

import { INCORRECT_FORMAT, GENERIC } from '../constants';
import { TransactionActionTypes } from '../actions/transactionActions';
import { TransactionDisplayPayload, TransactionTypes } from '../types/transactionTypes';

import getReceiverAddress from '../util/getReceiverAddress';
import { Payload, TransactionsActionType, TransactionState, ReceiverPayload } from '../types/transactionTypes';
import { ChainState } from '../types/sourceTargetTypes';
import logger from '../util/logger';
import { evalUnits } from '../util/evalUnits';

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
  }
};

const isReadyToExecute = (state: TransactionState): boolean => {
  const { transactionRunning, senderAccount } = state;
  const inputReady = isInputReady(state);
  return Boolean(!transactionRunning && inputReady && senderAccount);
};

const setReceiver = (state: TransactionState, payload: ReceiverPayload): TransactionState => {
  const { unformattedReceiverAddress, sourceChainDetails, targetChainDetails } = payload;
  const transactionReadyToExecute = isReadyToExecute(state);
  if (!unformattedReceiverAddress) {
    return {
      ...state,
      addressValidationError: null,
      showBalance: false,
      unformattedReceiverAddress,
      receiverAddress: null,
      genericReceiverAccount: null,
      formatFound: null,
      transactionReadyToExecute,
      estimatedFee: null,
      payloadEstimatedFeeLoading: false
    };
  }

  const { receiverAddress, formatFound } = validateAccount(
    unformattedReceiverAddress,
    sourceChainDetails,
    targetChainDetails
  )!;

  const { chain: targetChain } = targetChainDetails;
  const { chain: sourceChain } = sourceChainDetails;

  if (formatFound === INCORRECT_FORMAT) {
    return {
      ...state,
      addressValidationError: 'Invalid address',
      showBalance: false,
      unformattedReceiverAddress,
      receiverAddress: null,
      genericReceiverAccount: null,
      formatFound,
      transactionReadyToExecute: false
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
      transactionReadyToExecute: false
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
      payloadEstimatedFeeLoading: Boolean(state.transferAmount)
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
      payloadEstimatedFeeLoading: Boolean(state.transferAmount)
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
    transactionReadyToExecute: false
  };
};

export default function transactionReducer(state: TransactionState, action: TransactionsActionType): TransactionState {
  const transactionReadyToExecute = isReadyToExecute({ ...state, ...action.payload });
  switch (action.type) {
    case TransactionActionTypes.SET_PAYLOAD_ESTIMATED_FEE: {
      const {
        payloadEstimatedFeeError,
        payloadEstimatedFee: { estimatedFee, payload },
        payloadEstimatedFeeLoading
      } = action.payload;

      return {
        ...state,
        estimatedFee: !payloadEstimatedFeeError && transactionReadyToExecute ? estimatedFee : null,
        payloadEstimatedFeeError,
        payloadEstimatedFeeLoading,
        payload: payloadEstimatedFeeError ? null : payload,
        transactionReadyToExecute: payloadEstimatedFeeLoading ? false : transactionReadyToExecute
      };
    }

    case TransactionActionTypes.SET_TRANSFER_AMOUNT: {
      const { transferAmount, chainDecimals } = action.payload;
      const [actualValue, message] = evalUnits(transferAmount, chainDecimals);
      return {
        ...state,
        transferAmount: actualValue || null,
        transferAmountError: message,
        transactionReadyToExecute: false,
        estimatedFee: null
      };
    }
    case TransactionActionTypes.SET_REMARK_INPUT: {
      return { ...state, remarkInput: action.payload.remarkInput, transactionReadyToExecute };
    }
    case TransactionActionTypes.SET_CUSTOM_CALL_INPUT: {
      return { ...state, customCallInput: action.payload.customCallInput, transactionReadyToExecute };
    }
    case TransactionActionTypes.SET_WEIGHT_INPUT: {
      return { ...state, weightInput: action.payload.weightInput, transactionReadyToExecute };
    }

    case TransactionActionTypes.RESET:
      return {
        ...state,
        derivedReceiverAccount: null,
        estimatedFee: null,
        payloadEstimatedFeeError: null,
        genericReceiverAccount: null,
        receiverAddress: null,
        transferAmount: null,
        transferAmountError: null,
        unformattedReceiverAddress: null,
        addressValidationError: null,
        payload: null,
        transactionDisplayPayload: {} as TransactionDisplayPayload,
        showBalance: false,
        formatFound: null
      };
    case TransactionActionTypes.SET_RECEIVER_ADDRESS:
      return {
        ...state,
        receiverAddress: action.payload.receiverAddress,
        transactionReadyToExecute
      };
    case TransactionActionTypes.CREATE_TRANSACTION_STATUS:
      return { ...state, transactions: [action.payload.initialTransaction, ...state.transactions] };
    case TransactionActionTypes.UPDATE_CURRENT_TRANSACTION_STATUS:
      return updateTransaction(state, action.payload);
    case TransactionActionTypes.SET_RECEIVER:
      return setReceiver(state, action.payload.receiverPayload);
    case TransactionActionTypes.SET_TRANSACTION_RUNNING:
      return { ...state, transactionRunning: action.payload.transactionRunning };
    case TransactionActionTypes.COMBINE_REDUCERS:
      return { ...state, senderAccount: action.payload.senderAccount, action: action.payload.action };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
