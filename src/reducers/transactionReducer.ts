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
import type { TransactionsActionType, TransactionState, UpdatedTransanctionStatus } from '../types/transactionTypes';

const updateTransactionObject = (state: TransactionState, updatedValues: UpdatedTransanctionStatus) => {
  const newState = { ...state };
  if (state.currentTransaction) {
    Object.keys(updatedValues).map((key) => {
      newState.currentTransaction![key] = updatedValues[key];
    });
  }

  return newState;
};

export default function transactionReducer(state: TransactionState, action: TransactionsActionType): TransactionState {
  switch (action.type) {
    case TransactionActionTypes.SET_ESTIMATED_FEE:
      return { ...state, estimatedFee: action.payload.estimatedFee };
    case TransactionActionTypes.SET_RECEIVER_ADDRESS:
      return { ...state, receiverAddress: action.payload.receiverAddress };
    case TransactionActionTypes.CREATE_TRANSACTION_STATUS:
      return { ...state, currentTransaction: action.payload.initialTransaction };
    case TransactionActionTypes.UPDATE_CURRENT_TRANSACTION_STATUS:
      return updateTransactionObject(state, action.payload.updatedValues);
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
