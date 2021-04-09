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
import { Container } from 'semantic-ui-react';
import styled from 'styled-components';

import { MessageActionsCreators } from '../actions/messageActions';
import { TransactionActionCreators } from '../actions/transactionActions';
import { useUpdateMessageContext } from '../contexts/MessageContext';
import { useTransactionContext } from '../contexts/TransactionContext';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import { TransactionStatusEnum, TransanctionStatus } from '../types/transactionTypes';
import shortenItem from '../util/shortenItem';
import TransactionStatus from './TransactionStatus';
interface Props {
  className?: string;
}

const Transactions = ({ className }: Props) => {
  const { transactions } = useTransactionContext();
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { dispatchMessage } = useUpdateMessageContext();
  if (!transactions) {
    return null;
  }

  return (
    <>
      {transactions.map((transaction: TransanctionStatus) => {
        const onComplete = () => {
          dispatchTransaction(
            TransactionActionCreators.updateTransactionStatus(
              { status: TransactionStatusEnum.COMPLETED },
              transaction.id
            )
          );
          dispatchMessage(
            MessageActionsCreators.triggerSuccessMessage({
              message: `Transaction: ${shortenItem(transaction.hash)} is completed`
            })
          );
        };
        return (
          <Container className={className} key={transaction.id}>
            <TransactionStatus transaction={transaction} onComplete={onComplete} />
          </Container>
        );
      })}
    </>
  );
};

export default styled(Transactions)``;
