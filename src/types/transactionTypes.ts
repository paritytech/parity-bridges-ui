// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import TransactionActions from '../actions/transactionActions';

export interface TransactionContextType {
  estimatedFee: string | null;
}

interface Payload {
  [propName: string]: any;
}

export interface TransactionState {
  estimatedFee: string | null;
}

export type TransactionsActionType = { type: TransactionActions; payload: Payload };
