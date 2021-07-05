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
import getReceiverAddress from '../util/getReceiverAddress';
import {
  Payload,
  TransactionsActionType,
  TransactionState,
  TransactionStatusType,
  ReceiverPayload,
  EvalMessages
} from '../types/transactionTypes';
import { ChainState } from '../types/sourceTargetTypes';
import logger from '../util/logger';
import { evalUnits } from '../util/evalUnits';
import BN from 'bn.js';

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

const createTransaction = (state: TransactionState, initialTransaction: TransactionStatusType): TransactionState => {
  const newState = { ...state };
  newState.transactions.unshift(initialTransaction);
  return newState;
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

const setReceiver = (state: TransactionState, payload: ReceiverPayload): TransactionState => {
  const { unformattedReceiverAddress, sourceChainDetails, targetChainDetails } = payload;

  if (!unformattedReceiverAddress) {
    return {
      ...state,
      addressValidationError: null,
      showBalance: false,
      unformattedReceiverAddress,
      receiverAddress: null,
      genericReceiverAccount: null,
      formatFound: null
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
      formatFound
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
      formatFound
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
      formatFound
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
      formatFound
    };
  }

  return {
    ...state,
    addressValidationError: `Unsupported address SS58 prefix: ${formatFound}`,
    showBalance: false,
    unformattedReceiverAddress,
    receiverAddress: null,
    genericReceiverAccount: null,
    formatFound
  };
};

export default function transactionReducer(state: TransactionState, action: TransactionsActionType): TransactionState {
  switch (action.type) {
    case TransactionActionTypes.SET_ESTIMATED_FEE:
      return {
        ...state,
        estimatedFee: action.payload.estimatedFeeError ? null : action.payload.estimatedFee,
        estimatedFeeError: action.payload.estimatedFeeError,
        estimatedFeeLoading: action.payload.estimatedFeeLoading
      };
    case TransactionActionTypes.SET_TRANSFER_AMOUNT: {
      const { transferAmount, chainDecimals } = action.payload;
      const [actualValue, message] = evalUnits(transferAmount, chainDecimals);
      return {
        ...state,
        transferAmount: actualValue || null,
        transferAmountError: message
      };
    }
    case TransactionActionTypes.SET_PAYLOAD: {
      return {
        ...state,
        payload: action.payload.payloadError ? null : action.payload.payload,
        payloadError: action.payload.payloadError
      };
    }
    case TransactionActionTypes.RESET:
      return {
        ...state,
        derivedReceiverAccount: null,
        estimatedFee: null,
        estimatedFeeError: null,
        genericReceiverAccount: null,
        receiverAddress: null,
        unformattedReceiverAddress: null,
        addressValidationError: null,
        payload: null,
        payloadError: null,
        showBalance: false,
        formatFound: null
      };
    case TransactionActionTypes.SET_RECEIVER_ADDRESS:
      return { ...state, receiverAddress: action.payload.receiverAddress };
    case TransactionActionTypes.CREATE_TRANSACTION_STATUS:
      return createTransaction(state, action.payload.initialTransaction);
    case TransactionActionTypes.UPDATE_CURRENT_TRANSACTION_STATUS:
      return updateTransaction(state, action.payload);
    case TransactionActionTypes.SET_RECEIVER:
      return setReceiver(state, action.payload.receiverPayload);
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
