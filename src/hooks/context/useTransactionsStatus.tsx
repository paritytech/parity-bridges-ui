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

import { TransactionStatusEnum, TransactionStatusType, TransactionTypes } from '../../types/transactionTypes';
import { useUpdateMessageContext } from '../../contexts/MessageContext';

import useChainGetters from '../chain/useChainGetters';
import { useSubscriptionsContext } from '../../contexts/SubscriptionsContextProvider';
import { getChainSubscriptionsKey } from '../../util/chainsUtils';

import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';
import useLaneId from '../chain/useLaneId';
import { useCallback, useEffect } from 'react';
import { TransactionActionCreators } from '../../actions/transactionActions';
import isEqual from 'lodash/isEqual';
import usePrevious from '../react/usePrevious';
import { genericCall } from '../../util/apiUtlis';
import { handleInternalTransactionUpdates, handleTransactionUpdates } from '../../util/transactions/';

export default function useTransactionsStatus(
  transactions: TransactionStatusType[],
  evaluatingTransactions: boolean,
  dispatchTransaction: Function
) {
  const { dispatchMessage } = useUpdateMessageContext();
  const { getValuesByChain } = useChainGetters();

  const subscriptions = useSubscriptionsContext();
  const prevSubscriptions = usePrevious(subscriptions);

  const {
    sourceChainDetails: { chain: currentSourceChain }
  } = useSourceTarget();
  const apiCalls = useApiCallsContext();
  const laneId = useLaneId();

  const dispatch = useCallback(
    (error: string | null, data: TransactionStatusType[] | null, loading: boolean) =>
      dispatchTransaction(TransactionActionCreators.updateTransactionsStatus(error, data, loading)),
    [dispatchTransaction]
  );

  useEffect(() => {
    const getTransactionStatus = async () => {
      const updatedTransactions = await Promise.all(
        transactions.map(async (transaction: TransactionStatusType) => {
          if (transaction.status === TransactionStatusEnum.COMPLETED) {
            return transaction;
          }

          const { sourceChain, targetChain } = transaction;
          if (transaction.type === TransactionTypes.INTERNAL_TRANSFER) {
            const updatedTransaction = handleInternalTransactionUpdates(transaction, sourceChain);
            return updatedTransaction;
          }

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

          return updatedTransaction;
        })
      );

      if (!isEqual(transactions, updatedTransactions)) {
        return updatedTransactions;
      }
      return transactions;
    };
    const transactionsInProgress = transactions.find(
      ({ status }) => status === TransactionStatusEnum.IN_PROGRESS || status === TransactionStatusEnum.FINALIZED
    );
    const updatedSubscriptions = prevSubscriptions !== subscriptions;

    if (!evaluatingTransactions && transactionsInProgress && updatedSubscriptions) {
      genericCall({
        call: getTransactionStatus,
        dispatch
      });
    }
  }, [
    apiCalls,
    currentSourceChain,
    dispatch,
    dispatchMessage,
    dispatchTransaction,
    evaluatingTransactions,
    getValuesByChain,
    laneId,
    prevSubscriptions,
    subscriptions,
    transactions
  ]);
}
