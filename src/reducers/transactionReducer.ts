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
import { TransactionDisplayPayload } from '../types/transactionTypes';

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

const isReadyToExecute = (state: TransactionState): boolean => {
  const { transactionRunning, receiverAddress, transferAmount, senderAccount } = state;
  return Boolean(!transactionRunning && receiverAddress && transferAmount && senderAccount);
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
      transactionReadyToExecute
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
      estimatedFeeLoading: Boolean(state.transferAmount)
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
      estimatedFeeLoading: Boolean(state.transferAmount)
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
  console.log(action);
  switch (action.type) {
    case TransactionActionTypes.SET_ESTIMATED_FEE: {
      const { estimatedFeeError, estimatedFeeLoading } = action.payload;

      let estimatedFee = null;

      if (
        !estimatedFeeError &&
        !estimatedFeeLoading &&
        action.payload.estimatedFee &&
        !state.estimatedFeeError &&
        !state.transferAmountError
      ) {
        estimatedFee = action.payload.estimatedFee;
      }

      return {
        ...state,
        estimatedFee,
        estimatedFeeError: estimatedFeeError,
        estimatedFeeLoading: estimatedFeeLoading,
        transactionReadyToExecute: estimatedFeeLoading ? false : isReadyToExecute(state) && estimatedFee
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
        estimatedFeeLoading: Boolean(actualValue) && Boolean(state.receiverAddress),
        estimatedFee: null
      };
    }
    case TransactionActionTypes.SET_PAYLOAD: {
      const { payloadError, payload } = action.payload;
      return {
        ...state,
        payload: payloadError ? null : payload,
        payloadError,
        estimatedFee: null
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
        transferAmount: null,
        transferAmountError: null,
        unformattedReceiverAddress: null,
        addressValidationError: null,
        payload: null,
        payloadError: null,
        transactionDisplayPayload: {} as TransactionDisplayPayload,
        showBalance: false,
        formatFound: null
      };
    case TransactionActionTypes.SET_RECEIVER_ADDRESS:
      return {
        ...state,
        receiverAddress: action.payload.receiverAddress,
        transactionReadyToExecute: isReadyToExecute(state)
      };
    case TransactionActionTypes.CREATE_TRANSACTION_STATUS:
      return { ...state, transactions: [action.payload.initialTransaction, ...state.transactions] };
    case TransactionActionTypes.UPDATE_CURRENT_TRANSACTION_STATUS:
      return updateTransaction(state, action.payload);
    case TransactionActionTypes.SET_RECEIVER:
      return setReceiver(state, action.payload.receiverPayload);
    case TransactionActionTypes.SET_TRANSACTION_RUNNING:
      return { ...state, transactionRunning: action.payload.transactionRunning };
    case TransactionActionTypes.SET_EVALUATING_TRANSACTIONS:
      return { ...state, evaluatingTransactions: action.payload.evaluatingTransactions };
    case TransactionActionTypes.UPDATE_TRANSACTIONS_STATUS:
      return { ...state, transactions: action.payload.transactions };
    case TransactionActionTypes.SET_SENDER_ACCOUNT:
      return { ...state, senderAccount: action.payload.senderAccount };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
