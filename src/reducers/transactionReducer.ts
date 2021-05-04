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

import { TransactionActionTypes } from '../actions/transactionActions';
import type { Payload, TransactionsActionType, TransactionState, TransanctionStatus } from '../types/transactionTypes';

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

const createTransaction = (state: TransactionState, initialTransaction: TransanctionStatus): TransactionState => {
  const newState = { ...state };
  newState.transactions.unshift(initialTransaction);
  return newState;
};

export default function transactionReducer(state: TransactionState, action: TransactionsActionType): TransactionState {
  switch (action.type) {
    case TransactionActionTypes.SET_ESTIMATED_FEE:
      return { ...state, estimatedFee: action.payload.estimatedFee };
    case TransactionActionTypes.SET_RECEIVER_ADDRESS:
      return { ...state, receiverAddress: action.payload.receiverAddress };
    case TransactionActionTypes.SET_UNFORMATTED_RECEIVER_ADDRESS:
      return { ...state, unformattedReceiverAddress: action.payload.unformattedReceiverAddress };
    case TransactionActionTypes.CREATE_TRANSACTION_STATUS:
      return createTransaction(state, action.payload.initialTransaction);
    case TransactionActionTypes.UPDATE_CURRENT_TRANSACTION_STATUS:
      return updateTransaction(state, action.payload);
    case TransactionActionTypes.SET_DERIVED_RECEIVER_ACCOUNT:
      return { ...state, derivedReceiverAccount: action.payload.derivedReceiverAccount };
    case TransactionActionTypes.SET_GENERIC_RECEIVER_ACCOUNT:
      return { ...state, genericReceiverAccount: action.payload.genericReceiverAccount };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
