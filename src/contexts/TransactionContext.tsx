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

import React, { useContext, useReducer, useEffect } from 'react';
import useTransactionsStatus from '../hooks/context/useTransactionsStatus';
import transactionReducer from '../reducers/transactionReducer';
import { TransactionState, TransactionsActionType, TransactionDisplayPayload } from '../types/transactionTypes';
import { TransactionActionCreators } from '../actions/transactionActions';
import { useAccountContext } from './AccountContextProvider';

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
  const { account } = useAccountContext();

  const [transactionsState, dispatchTransaction] = useReducer(transactionReducer, {
    senderAccount: null,
    transferAmount: null,
    transferAmountError: null,
    estimatedFee: null,
    estimatedFeeError: null,
    estimatedFeeLoading: false,
    receiverAddress: null,
    unformattedReceiverAddress: null,
    derivedReceiverAccount: null,
    genericReceiverAccount: null,
    evaluatingTransactions: false,
    transactions: [],
    transactionDisplayPayload: {} as TransactionDisplayPayload,
    transactionRunning: false,
    transactionReadyToExecute: false,
    addressValidationError: null,
    showBalance: false,
    formatFound: null,
    payload: null,
    payloadError: null,
    payloadHex: null
  });

  useTransactionsStatus(transactionsState.transactions, transactionsState.evaluatingTransactions, dispatchTransaction);

  useEffect((): void => {
    dispatchTransaction(TransactionActionCreators.setSenderAccount(account ? account.address : null));
  }, [account, dispatchTransaction]);

  return (
    <TransactionContext.Provider value={transactionsState}>
      <UpdateTransactionContext.Provider value={{ dispatchTransaction }}>{children}</UpdateTransactionContext.Provider>
    </TransactionContext.Provider>
  );
}
