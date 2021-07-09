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

import { useTransactionContext } from '../contexts/TransactionContext';

import TransactionStatusMock from './TransactionStatusMock';

import useResetTransactionState from '../hooks/transactions/useResetTransactionState';
import { TransactionStatusType } from '../types/transactionTypes';
import TransactionStatus, { TransactionDisplayProps } from './TransactionStatus';

interface Props extends TransactionDisplayProps {
  type?: string;
}

const Transactions = ({ type, ...transactionDisplayProps }: Props) => {
  const { transactions } = useTransactionContext();
  useResetTransactionState(type);

  return (
    <>
      <TransactionStatusMock type={type} />
      {Boolean(transactions.length) &&
        transactions.map((transaction: TransactionStatusType) => {
          return (
            <TransactionStatus
              key={transaction.id}
              transaction={transaction}
              transactionDisplayProps={{ ...transactionDisplayProps }}
            />
          );
        })}
    </>
  );
};

export default Transactions;
