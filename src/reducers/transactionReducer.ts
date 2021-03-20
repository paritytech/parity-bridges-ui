// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import TransactionActions from '../actions/transactionActions';
import type { TransactionsActionType, TransactionState } from '../types/transactionTypes';

export default function transactionReducer(state: TransactionState, action: TransactionsActionType): TransactionState {
  switch (action.type) {
    case TransactionActions.SET_ESTIMATED_FEE:
      return { ...state, estimatedFee: action.payload.estimatedFee };

    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
