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

import { TransactionStatusEnum, TransactionStatusType } from '../../types/transactionTypes';
import { useUpdateMessageContext } from '../../contexts/MessageContext';

import useChainGetters from '../chain/useChainGetters';
import { useSubscriptionsContext } from '../../contexts/SubscriptionsContextProvider';
import { getChainSubscriptionsKey } from '../../util/chainsUtils';
import { handleTransactionUpdates } from '../../util/transactionUtils';

import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';
import useLaneId from '../chain/useLaneId';
import { useEffect } from 'react';
import { TransactionActionCreators } from '../../actions/transactionActions';
import isEqual from 'lodash/isEqual';

export default function useTransactionsStatus(transactions: TransactionStatusType[], dispatchTransaction: Function) {
  const { dispatchMessage } = useUpdateMessageContext();
  const { getValuesByChain } = useChainGetters();

  const subscriptions = useSubscriptionsContext();

  const {
    sourceChainDetails: { chain: currentSourceChain }
  } = useSourceTarget();
  const apiCalls = useApiCallsContext();
  const laneId = useLaneId();

  useEffect(() => {
    const getTransactionStatus = async () => {
      const updatedTransactions = await Promise.all(
        transactions.map(async (transaction: TransactionStatusType) => {
          if (transaction.status === TransactionStatusEnum.COMPLETED || transaction.evaluating) {
            return transaction;
          }
          dispatchTransaction(
            TransactionActionCreators.updateTransactionStatus(
              {
                evaluating: true
              },
              transaction.id
            )
          );
          const { sourceChain, targetChain } = transaction;
          const { api: targetApi } = getValuesByChain(targetChain);
          const { sourceRole, targetRole } = getChainSubscriptionsKey({
            currentSourceChain,
            sourceChain
          });

          const sourceSubscriptions = subscriptions[sourceRole];
          const targetSubscriptions = subscriptions[targetRole];

          const updatedTransaction = await handleTransactionUpdates({
            transaction,
            sourceSubscriptions,
            targetSubscriptions,
            apiCalls: {
              targetApi,
              ...apiCalls
            },
            laneId,
            dispatchMessage
          });

          if (isEqual(transaction, updatedTransaction)) {
            dispatchTransaction(
              TransactionActionCreators.updateTransactionStatus(
                {
                  evaluating: false
                },
                transaction.id
              )
            );
          }

          return updatedTransaction;
        })
      );

      if (!isEqual(transactions, updatedTransactions)) {
        dispatchTransaction(TransactionActionCreators.updateTransactionsStatus(updatedTransactions));
      }
    };

    getTransactionStatus();
  }, [
    apiCalls,
    currentSourceChain,
    dispatchMessage,
    dispatchTransaction,
    getValuesByChain,
    laneId,
    subscriptions,
    transactions
  ]);
}