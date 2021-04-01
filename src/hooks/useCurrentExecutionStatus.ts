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

import { SOURCE, TARGET } from '../constants';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useDashboard from '../hooks/useDashboard';
import useLaneId from '../hooks/useLaneId';
import useLoadingApi from '../hooks/useLoadingApi';
import getSubstrateDynamicNames from '../util/getSubstrateDynamicNames';

export default function useCurrentExecutionStatus() {
  const [nonceOfTargetFinalizedBlock, setNonceOfTargetFinalizedBlock] = useState<null | number>(null);
  const [latestReceivedNonceRuntimeApi, setLatestReceivedNonceRuntimeApi] = useState(0);
  const { api: targetApi } = useApiTargetPromiseContext();
  const { sourceChain } = useSourceTarget();
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
    bestBlockFinalizedOnTarget,
    laneId,
    latestReceivedNonceMethodName,
    targetApi.registry,
    targetApi.rpc.chain,
    targetApi.rpc.state
  ]);

  const empty = {
    show: false,
    step1: '',
    step2: '',
    step3: '',
    step4: '',
    step5: '',
    step6: ''
  };

  if (!areApiLoading || !currentTransaction) {
    return empty;
  }

  const step1 = currentTransaction.block > 0 ? `included in block ${currentTransaction.block}` : 'RUNNING';
  const isDone = (status: boolean | null) => (currentTransaction.block > 0 && status ? 'DONE' : 'RUNNING');
  const step2 = parseInt(bestBlockFinalized) > currentTransaction.block;
  const step3 = parseInt(importedHeaders) > currentTransaction.block;

  const step4 = latestReceivedNonceRuntimeApi > currentTransaction.messageNonce;

  const step5 = nonceOfTargetFinalizedBlock ? nonceOfTargetFinalizedBlock > currentTransaction.messageNonce : false;

  const step6 = latestReceivedNonceOnSource > currentTransaction.messageNonce;

  return {
    show: true,
    step1,
    step2: isDone(step2),
    step3: isDone(step3),
    step4: isDone(step4),
    step5: isDone(step5),
    step6: isDone(step6)
  };
}
