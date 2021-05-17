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

const useTransactionSteps = ({ transaction, onComplete }: Props) => {
  const [steps, setSteps] = useState<Array<Step>>([]);
  const [transactionNonceOfTargetFinalizedBlock, setTransactionNonceOfTargetFinalizedBlock] = useMountedState<
    null | number
  >(null);
  const [targetMessageDeliveryBlock, setTargetMessageDeliveryBlock] = useMountedState('');
  const [finished, setFinished] = useState(false);

  const { getNonceByHash, latestReceivedNonceRuntimeApi, nonceOfCurrentTargetBlock } = useTransactionNonces({
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
    const getNonceOfTargetFinalizedBlock = async () => {
      const nonce = await getNonceByHash(parseInt(targetMessageDeliveryBlock));
      setTransactionNonceOfTargetFinalizedBlock(nonce);
    };

    if (targetMessageDeliveryBlock) {
      getNonceOfTargetFinalizedBlock();
    }
  }, [targetMessageDeliveryBlock, getNonceByHash, setTransactionNonceOfTargetFinalizedBlock]);

  useEffect(() => {
    if (!areApiLoading || !transaction || finished) {
      return;
    }

    const stepEvaluator = (transactionValue: string | number | null, chainValue: string | number | null): boolean => {
      if (!transactionValue || !chainValue) return false;

      const bnChainValue = new BN(chainValue);
      const bnTransactionValue = new BN(transactionValue);
      return bnChainValue.gt(bnTransactionValue);
    };

    const completionStatus = (isCompleted: boolean): TransactionStatusEnum => {
      if (transaction.id === 0) {
        return TransactionStatusEnum.NOT_STARTED;
      }
      return isCompleted ? TransactionStatusEnum.COMPLETED : TransactionStatusEnum.IN_PROGRESS;
    };

    const sourceTransactionFinalized = stepEvaluator(transaction.block, bestBlockFinalized);
    const blockFinalityRelayed = stepEvaluator(transaction.block, bestBridgedFinalizedBlockOnTarget);
    const messageDelivered = stepEvaluator(transaction.messageNonce, latestReceivedNonceRuntimeApi);
    const messageFinalizedOnTarget = stepEvaluator(transactionNonceOfTargetFinalizedBlock, nonceOfCurrentTargetBlock);
    const sourceConfirmationReceived = stepEvaluator(transaction.messageNonce, latestReceivedNonceOnSource);
    const onChainCompleted = (value: boolean) => completionStatus(value) === TransactionStatusEnum.COMPLETED;

    if (messageDelivered && !targetMessageDeliveryBlock) {
      setTargetMessageDeliveryBlock(bestBlockFinalizedOnTarget);
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
        labelOnChain: onChainCompleted(messageFinalizedOnTarget) && targetMessageDeliveryBlock,
        status: completionStatus(messageFinalizedOnTarget)
      },
      {
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
    areApiLoading,
    bestBlockFinalized,
    bestBlockFinalizedOnTarget,
    bestBridgedFinalizedBlockOnTarget,
    finished,
    latestReceivedNonceOnSource,
    latestReceivedNonceRuntimeApi,
    transactionNonceOfTargetFinalizedBlock,
    onComplete,
    sourceChain,
    targetChain,
    targetMessageDeliveryBlock,
    transaction,
    nonceOfCurrentTargetBlock,
    setTargetMessageDeliveryBlock
  ]);

  return steps;
};

export default useTransactionSteps;
