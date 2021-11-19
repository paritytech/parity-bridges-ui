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
import { TransactionStatusType, TransactionTypes, TransactionStatusEnum } from '../types/transactionTypes';
import TransactionContainer, { TransactionDisplayProps } from './TransactionContainer';
import { Typography } from '@material-ui/core';

interface Props extends TransactionDisplayProps {
  type: TransactionTypes;
}

const onGoing = (status: TransactionStatusEnum) =>
  status === TransactionStatusEnum.IN_PROGRESS || status === TransactionStatusEnum.CREATED;
const completed = (status: TransactionStatusEnum) =>
  status === TransactionStatusEnum.COMPLETED ||
  status === TransactionStatusEnum.FAILED ||
  status === TransactionStatusEnum.FINALIZED;

const Transactions = ({ type, ...transactionDisplayProps }: Props) => {
  const { transactions } = useTransactionContext();

  const onGoingTransactions = transactions.filter((transaction) => onGoing(transaction.status));

  const completedTransactions = transactions.filter((transaction) => completed(transaction.status));

  return (
    <>
      <TransactionStatusMock type={type} />
      {Boolean(onGoingTransactions.length) && <Typography>On Going</Typography>}
      {Boolean(onGoingTransactions.length) &&
        onGoingTransactions.map((transaction: TransactionStatusType) => {
          return (
            <TransactionContainer
              key={transaction.id}
              transaction={transaction}
              transactionDisplayProps={{ ...transactionDisplayProps }}
              expanded
            />
          );
        })}
      {Boolean(completedTransactions.length) && <Typography>On Completed</Typography>}
      {Boolean(completedTransactions.length) &&
        completedTransactions.map((transaction: TransactionStatusType) => {
          return (
            <TransactionContainer
              key={transaction.id}
              transaction={transaction}
              transactionDisplayProps={{ ...transactionDisplayProps }}
              expanded={false}
            />
          );
        })}
    </>
  );
};

export default Transactions;
