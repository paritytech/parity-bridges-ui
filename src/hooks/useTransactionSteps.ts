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
import { useMountedState } from './useMountedState';
import useTransactionNonces from '../hooks/useTransactionNonces';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useDashboard from '../hooks/useDashboard';

import useLoadingApi from '../hooks/useLoadingApi';
import { getSourceTargetRole } from '../util/chainsUtils';
import { Step, TransactionStatusEnum, TransactionStatusType } from '../types/transactionTypes';

interface Props {
  transaction: TransactionStatusType;
  onComplete: () => void;
}

interface MessageOnTarget {
  nonce: number;
  block: string;
}

const useTransactionSteps = ({ transaction, onComplete }: Props) => {
  const [steps, setSteps] = useState<Array<Step>>([]);
  const [messageOnTarget, setMessageOnTarget] = useMountedState({} as MessageOnTarget);
  const [finished, setFinished] = useState(false);

  // 4.2 * We keep the related nonce in nonceOfCurrentTargetBlock so we can determine when the message in the target block was finalized.
  const { latestReceivedNonceRuntimeApi, nonceOfCurrentTargetBlock } = useTransactionNonces({
    transaction
  });

  const areApiLoading = useLoadingApi();

  const { sourceChain, targetChain } = transaction;
  const { sourceRole, targetRole } = getSourceTargetRole({
    useSourceTarget,
    sourceChain
  });

  const {
    bestBlockFinalized,
    outboundLanes: { latestReceivedNonce: latestReceivedNonceOnSource }
  } = useDashboard(sourceRole);
  const {
    bestBridgedFinalizedBlock: bestBridgedFinalizedBlockOnTarget,
    bestBlockFinalized: bestBlockFinalizedOnTarget
  } = useDashboard(targetRole);

  useEffect(() => {
    if (!areApiLoading || !transaction || finished) {
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

    // 1. We wait until the block transaction gets finalized / transaction.block < source.bestBlockFinalized
    const sourceTransactionFinalized = stepEvaluator(transaction.block, bestBlockFinalized);
    // 2. When the target chain knows about a bigger source block number we infer that transaction block was realayed to target chain.
    const blockFinalityRelayed = stepEvaluator(transaction.block, bestBridgedFinalizedBlockOnTarget);
    // 3.1 We read the latest received nonce of the target chain rpc state call.
    // 3.2 With the value obtained we compare it with the transaction nonce, if the value is bigger or equal then means target chain is aware about this nonce.
    const messageDelivered = stepEvaluator(transaction.messageNonce, latestReceivedNonceRuntimeApi.nonce);
    // 4.1 *
    // 4.2 **
    // 4.3 When the current nonce in the target is bigger than the message nonce related to the message block, we set the step as completed.
    const messageFinalizedOnTarget = stepEvaluator(messageOnTarget.nonce, nonceOfCurrentTargetBlock);

    const sourceConfirmationReceived = stepEvaluator(transaction.messageNonce, latestReceivedNonceOnSource);
    const onChainCompleted = (value: boolean) => completionStatus(value) === TransactionStatusEnum.COMPLETED;

    // 4.1 * We catch the current target bestBlock and related nonce only if previous step was finished and we didn't saved the information of message in target chain.
    if (messageDelivered && !messageOnTarget.block) {
      setMessageOnTarget(latestReceivedNonceRuntimeApi);
    }

    setSteps([
      {
        chainType: sourceChain,
        label: 'Include message in block',
        labelOnChain: transaction.block,
        status: completionStatus(!!transaction.block)
      },
      {
        chainType: sourceChain,
        label: 'Finalize block',
        status: completionStatus(sourceTransactionFinalized)
      },
      {
        chainType: targetChain,
        label: 'Relay block',
        status: completionStatus(blockFinalityRelayed)
      },
      {
        chainType: targetChain,
        label: 'Deliver message',
        labelOnChain: onChainCompleted(messageDelivered) && transaction.messageNonce,
        status: completionStatus(messageDelivered)
      },
      {
        chainType: targetChain,
        label: 'Finalize message in target block',
        labelOnChain: onChainCompleted(messageFinalizedOnTarget) && messageOnTarget.block,
        status: completionStatus(messageFinalizedOnTarget)
      },
      {
        chainType: sourceChain,
        label: 'Confirm delivery',
        status: completionStatus(messageFinalizedOnTarget && sourceConfirmationReceived)
      }
    ]);

    if (messageFinalizedOnTarget && sourceConfirmationReceived) {
      onComplete();
      setFinished(true);
    }
  }, [
    areApiLoading,
    bestBlockFinalized,
    bestBlockFinalizedOnTarget,
    bestBridgedFinalizedBlockOnTarget,
    finished,
    latestReceivedNonceOnSource,
    latestReceivedNonceRuntimeApi,
    messageOnTarget.nonce,
    onComplete,
    sourceChain,
    targetChain,
    messageOnTarget.block,
    transaction,
    nonceOfCurrentTargetBlock,
    setMessageOnTarget
  ]);

  return steps;
};

export default useTransactionSteps;
