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

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import useTransactionNonces from './useTransactionNonces';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { useSubscriptionsContext } from '../../contexts/SubscriptionsContextProvider';

import useLoadingApi from '../connections/useLoadingApi';
import { getChainSubscriptionsKey } from '../../util/chainsUtils';
import { Step, TransactionStatusEnum, TransactionStatusType } from '../../types/transactionTypes';

interface Props {
  transaction: TransactionStatusType;
  onComplete: () => void;
}

const useTransactionSteps = ({ transaction, onComplete }: Props) => {
  const [steps, setSteps] = useState<Array<Step>>([]);
  const [deliveryBlock, setDeliveryBlock] = useState<string | null>();
  const [finished, setFinished] = useState(false);
  const subscriptions = useSubscriptionsContext();
  const { nonceOfBestTargetBlock, nonceOfFinalTargetBlock } = useTransactionNonces({
    transaction
  });

  const { areApiReady } = useLoadingApi();

  const { sourceChain, targetChain } = transaction;
  const { sourceRole, targetRole } = getChainSubscriptionsKey({
    useSourceTarget,
    sourceChain
  });

  const {
    bestBlockFinalized,
    outboundLanes: { latestReceivedNonce: latestReceivedNonceOnSource }
  } = subscriptions[sourceRole];
  const {
    bestBridgedFinalizedBlock: bestBridgedFinalizedBlockOnTarget,
    bestBlockFinalized: bestBlockFinalizedOnTarget,
    bestBlock: bestBlockOnTarget
  } = subscriptions[targetRole];

  useEffect(() => {
    if (!areApiReady || !transaction || finished) {
      return;
    }

    const stepEvaluator = (transactionValue: string | number | null, chainValue: string | number | null): boolean => {
      if (!transactionValue || !chainValue) return false;

      const bnChainValue = new BN(chainValue);
      const bnTransactionValue = new BN(transactionValue);

      return bnChainValue.gte(bnTransactionValue);
    };

    const completionStatus = (isCompleted: boolean): TransactionStatusEnum => {
      if (transaction.id === 0) {
        return TransactionStatusEnum.NOT_STARTED;
      }
      return isCompleted ? TransactionStatusEnum.COMPLETED : TransactionStatusEnum.IN_PROGRESS;
    };

    // 1. We wait until the block transaction gets finalized  ( source.bestBlockFinalized is greater or equal to transaction.block )
    const sourceTransactionFinalized = stepEvaluator(transaction.block, bestBlockFinalized);
    // 2. When the target chain knows about a bigger source block number we infer that transaction block was realayed to target chain.
    const blockFinalityRelayed = stepEvaluator(transaction.block, bestBridgedFinalizedBlockOnTarget);
    // 3.1 We read the latest received nonce of the target chain rpc state call.
    // 3.2 With the value obtained we compare it with the transaction nonce, if the value is bigger or equal then means target chain is aware about this nonce.
    const messageDelivered = stepEvaluator(transaction.messageNonce, nonceOfBestTargetBlock);
    // 4.1 *
    // 4.2 We match the transaction nonce with the current nonce of the best finalized target block
    const messageFinalizedOnTarget = stepEvaluator(transaction.messageNonce, nonceOfFinalTargetBlock);

    // 5. Once the source chain is confirms through the latestReceivedNonceOnSource, that target chain is aware about the message nonce, the transaction is completed.
    const sourceConfirmationReceived = stepEvaluator(transaction.messageNonce, latestReceivedNonceOnSource);
    const onChainCompleted = (value: boolean) => completionStatus(value) === TransactionStatusEnum.COMPLETED;

    // 4.1 * We catch the best block on target related to the message delivery.
    if (messageDelivered && !deliveryBlock) {
      setDeliveryBlock(bestBlockOnTarget);
    }

    setSteps([
      {
        id: 'test-step-include-message-block',
        chainType: sourceChain,
        label: 'Include message in block',
        labelOnChain: transaction.block,
        status: completionStatus(!!transaction.block)
      },
      {
        id: 'test-step-finalized-block',
        chainType: sourceChain,
        label: 'Finalize block',
        status: completionStatus(sourceTransactionFinalized)
      },
      {
        id: 'test-step-relay-block',
        chainType: targetChain,
        label: 'Relay block',
        status: completionStatus(blockFinalityRelayed)
      },
      {
        id: 'test-step-deliver-message-block',
        chainType: targetChain,
        label: 'Deliver message in target block',
        labelOnChain: onChainCompleted(messageDelivered) && deliveryBlock,
        status: completionStatus(messageDelivered)
      },
      {
        id: 'test-step-finalized-message',
        chainType: targetChain,
        label: 'Finalize message',
        status: completionStatus(messageFinalizedOnTarget)
      },
      {
        id: 'test-step-confirm-delivery',
        chainType: sourceChain,
        label: 'Confirm delivery',
        status: completionStatus(sourceConfirmationReceived)
      }
    ]);

    if (sourceConfirmationReceived) {
      onComplete();
      setFinished(true);
    }
  }, [
    areApiReady,
    bestBlockFinalized,
    bestBlockFinalizedOnTarget,
    bestBlockOnTarget,
    bestBridgedFinalizedBlockOnTarget,
    deliveryBlock,
    finished,
    latestReceivedNonceOnSource,
    nonceOfBestTargetBlock,
    nonceOfFinalTargetBlock,
    onComplete,
    setDeliveryBlock,
    sourceChain,
    targetChain,
    transaction
  ]);

  return steps;
};

export default useTransactionSteps;
