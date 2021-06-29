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

import React from 'react';

import { MessageActionsCreators } from '../actions/messageActions';
import { TransactionActionCreators } from '../actions/transactionActions';
import { useUpdateMessageContext } from '../contexts/MessageContext';
import { useTransactionContext } from '../contexts/TransactionContext';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import { TransactionStatusEnum, TransactionStatusType } from '../types/transactionTypes';
import shortenItem from '../util/shortenItem';
import TransactionStatus, { TransactionDisplayProps } from './TransactionStatus';
import TransactionStatusMock from './TransactionStatusMock';
import useResetTransactionState from '../hooks/transactions/useResetTransactionState';

interface Props extends TransactionDisplayProps {
  type?: string;
}

const Transactions = ({ type, ...transactionDisplayProps }: Props) => {
  const { transactions } = useTransactionContext();
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { dispatchMessage } = useUpdateMessageContext();
  useResetTransactionState(type);

  return (
    <>
      {transactions.length ? (
        transactions.map((transaction: TransactionStatusType) => {
          const onComplete = () => {
            dispatchTransaction(
              TransactionActionCreators.updateTransactionStatus(
                { status: TransactionStatusEnum.COMPLETED },
                transaction.id
              )
            );
            dispatchMessage(
              MessageActionsCreators.triggerSuccessMessage({
                message: `Transaction: ${shortenItem(transaction.blockHash)} is completed`
              })
            );
          };
          return (
            <TransactionStatus
              key={transaction.id}
              transaction={transaction}
              onComplete={onComplete}
              transactionDisplayProps={{ ...transactionDisplayProps }}
            />
          );
        })
      ) : (
        <TransactionStatusMock type={type} />
      )}
    </>
  );
};

export default Transactions;
