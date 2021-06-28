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

import React, { useContext, useReducer } from 'react';

import transactionReducer from '../reducers/transactionReducer';
import { TransactionState, TransactionsActionType, TransactionDisplayPayload } from '../types/transactionTypes';

interface TransactionContextProviderProps {
  children: React.ReactElement;
}

export interface UpdateTransactionContext {
  dispatchTransaction: React.Dispatch<TransactionsActionType>;
}

export const TransactionContext: React.Context<TransactionState> = React.createContext({} as TransactionState);

export const UpdateTransactionContext: React.Context<UpdateTransactionContext> = React.createContext(
  {} as UpdateTransactionContext
);

export function useTransactionContext() {
  return useContext(TransactionContext);
}

export function useUpdateTransactionContext() {
  return useContext(UpdateTransactionContext);
}

export function TransactionContextProvider(props: TransactionContextProviderProps): React.ReactElement {
  const { children = null } = props;

  const [transaction, dispatchTransaction] = useReducer(transactionReducer, {
    derivedReceiverAccount: null,
    estimatedFee: null,
    estimatedFeeError: null,
    genericReceiverAccount: null,
    receiverAddress: null,
    unformattedReceiverAddress: null,
    transactions: [],
    addressValidationError: null,
    payload: null,
    payloadError: null,
    showBalance: false,
    formatFound: null,
    estimatedFeeLoading: false,
    payloadHex: null,
    TransactionDisplayPayload: {} as TransactionDisplayPayload
  });

  return (
    <TransactionContext.Provider value={transaction}>
      <UpdateTransactionContext.Provider value={{ dispatchTransaction }}>{children}</UpdateTransactionContext.Provider>
    </TransactionContext.Provider>
  );
}
