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

import { Codec } from '@polkadot/types/types';
import { useEffect, useState } from 'react';

import { TransactionActionCreators } from '../actions/transactionActions';
import { SOURCE, TARGET } from '../constants';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext, useUpdateTransactionContext } from '../contexts/TransactionContext';
import useDashboard from '../hooks/useDashboard';
import useLaneId from '../hooks/useLaneId';
import useLoadingApi from '../hooks/useLoadingApi';
import { TransactionStatusEnum } from '../types/transactionTypes';
import getSubstrateDynamicNames from '../util/getSubstrateDynamicNames';

interface Step {
  chainType: string;
  label: string;
  status: string;
}

export default function useCurrentExecutionStatus() {
  const [nonceOfTargetFinalizedBlock, setNonceOfTargetFinalizedBlock] = useState<null | number>(null);
  const [latestReceivedNonceRuntimeApi, setLatestReceivedNonceRuntimeApi] = useState(0);
  const [steps, setSteps] = useState<Array<Step>>([]);
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { api: targetApi } = useApiTargetPromiseContext();
  const { sourceChain, targetChain } = useSourceTarget();
  const laneId = useLaneId();
  const areApiLoading = useLoadingApi();
  const { currentTransaction } = useTransactionContext();
  const {
    bestBlockFinalized,
    outboundLanes: { latestReceivedNonce: latestReceivedNonceOnSource }
  } = useDashboard(SOURCE);
  const { importedHeaders, bestBlockFinalized: bestBlockFinalizedOnTarget } = useDashboard(TARGET);
  const { latestReceivedNonceMethodName } = getSubstrateDynamicNames(sourceChain);

  useEffect(() => {
    if (!areApiLoading || !currentTransaction) {
      return;
    }
    const getNonceByHash = async () => {
      const blockHash = await targetApi.rpc.chain.getBlockHash(bestBlockFinalizedOnTarget);
      const latestReceivedNonceCall = await targetApi.rpc.state.call<Codec>(
        latestReceivedNonceMethodName,
        laneId,
        blockHash.toJSON()
      );

      // @ts-ignore
      const latestReceivedNonceCallType = targetApi.registry.createType('MessageNonce', latestReceivedNonceCall);
      const latestReceivedNonce = latestReceivedNonceCallType.toString();
      setNonceOfTargetFinalizedBlock(parseInt(latestReceivedNonce));
    };

    const getLatestReceivedNonce = async () => {
      const latestReceivedNonceCall = await targetApi.rpc.state.call<Codec>(latestReceivedNonceMethodName, laneId);
      // @ts-ignore
      const latestReceivedNonceCallType = targetApi.registry.createType('MessageNonce', latestReceivedNonceCall);
      setLatestReceivedNonceRuntimeApi(parseInt(latestReceivedNonceCallType.toString()));
    };

    getNonceByHash();
    getLatestReceivedNonce();
  }, [
    areApiLoading,
    bestBlockFinalizedOnTarget,
    currentTransaction,
    laneId,
    latestReceivedNonceMethodName,
    targetApi.registry,
    targetApi.rpc.chain,
    targetApi.rpc.state
  ]);

  useEffect(() => {
    if (!areApiLoading || !currentTransaction) {
      return;
    }

    const stepEvaluator = (transactionValue: string | number | null, chainValue: number | null) => {
      if (!transactionValue || !chainValue) {
        return false;
      }
      return chainValue > transactionValue;
    };

    const isDone = (status: boolean | boolean) => (currentTransaction.block && status ? 'DONE' : 'RUNNING');
    const step1 = currentTransaction.block ? `included in block ${currentTransaction.block}` : isDone(false);
    const step2 = stepEvaluator(currentTransaction.block, parseInt(bestBlockFinalized));
    const step3 = stepEvaluator(currentTransaction.block, parseInt(importedHeaders));
    const step4 = stepEvaluator(currentTransaction.messageNonce, latestReceivedNonceRuntimeApi);
    const step5 = stepEvaluator(currentTransaction.messageNonce, nonceOfTargetFinalizedBlock);
    const step6 = stepEvaluator(currentTransaction.messageNonce, latestReceivedNonceOnSource);

    const steps = [
      { chainType: sourceChain, label: 'Including message in block', status: step1 },
      { chainType: sourceChain, label: 'Waiting for block finality on source', status: isDone(step2) },
      { chainType: targetChain, label: 'Source Chain block finality received on target', status: isDone(step3) },
      { chainType: targetChain, label: 'Message delivered', status: isDone(step4) },
      { chainType: targetChain, label: 'Message finality', status: isDone(step5) },
      { chainType: sourceChain, label: 'Delivery confirmation on source', status: isDone(step6) }
    ];

    if (step6) {
      dispatchTransaction(
        TransactionActionCreators.updateTransactionStatus({ status: TransactionStatusEnum.COMPLETED })
      );
    }

    setSteps(steps);
  }, [
    areApiLoading,
    bestBlockFinalized,
    currentTransaction,
    dispatchTransaction,
    importedHeaders,
    latestReceivedNonceOnSource,
    latestReceivedNonceRuntimeApi,
    nonceOfTargetFinalizedBlock,
    targetChain,
    sourceChain
  ]);

  return steps;
}
