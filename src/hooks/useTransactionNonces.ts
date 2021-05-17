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

import { useCallback, useEffect } from 'react';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useDashboard from './useDashboard';
import useLaneId from './useLaneId';
import useLoadingApi from './useLoadingApi';
import useChainGetters from './useChainGetters';
import { useMountedState } from './useMountedState';

import { isTransactionCompleted } from '../util/transactionUtils';
import { getSourceTargetRole } from '../util/chainsUtils';
import { TransactionStatusType } from '../types/transactionTypes';
import getSubstrateDynamicNames from '../util/getSubstrateDynamicNames';
interface Props {
  transaction: TransactionStatusType;
}

const useTransactionNonces = ({ transaction }: Props) => {
  const [latestReceivedNonceRuntimeApi, setLatestReceivedNonceRuntimeApi] = useMountedState(0);
  const [nonceOfCurrentTargetBlock, setNonceOfCurrentTargetBlock] = useMountedState<null | number>(null);
  const { getValuesByChain } = useChainGetters();

  const laneId = useLaneId();
  const areApiLoading = useLoadingApi();
  const { sourceChain, targetChain } = transaction;
  const { targetRole } = getSourceTargetRole({
    useSourceTarget,
    sourceChain
  });

  const { bestBlockFinalized: bestBlockFinalizedOnTarget } = useDashboard(targetRole);

  const { latestReceivedNonceMethodName } = getSubstrateDynamicNames(sourceChain);
  const { api: targetApi } = getValuesByChain(targetChain);

  const getNonceByHash = useCallback(
    async (targetBlock: number) => {
      const blockHash = await targetApi.rpc.chain.getBlockHash(targetBlock);
      const latestReceivedNonceCall = await targetApi.rpc.state.call<Codec>(
        latestReceivedNonceMethodName,
        laneId,
        blockHash.toJSON()
      );

      // @ts-ignore
      const latestReceivedNonceCallType = targetApi.registry.createType('MessageNonce', latestReceivedNonceCall);
      const latestReceivedNonce = latestReceivedNonceCallType.toString();
      return parseInt(latestReceivedNonce);
    },
    [laneId, latestReceivedNonceMethodName, targetApi.registry, targetApi.rpc.chain, targetApi.rpc.state]
  );

  useEffect(() => {
    if (!areApiLoading || !transaction || !transaction || isTransactionCompleted(transaction)) {
      return;
    }

    const getLatestReceivedNonce = async () => {
      const latestReceivedNonceCall = await targetApi.rpc.state.call<Codec>(latestReceivedNonceMethodName, laneId);
      // @ts-ignore
      const latestReceivedNonceCallType = targetApi.registry.createType('MessageNonce', latestReceivedNonceCall);
      setLatestReceivedNonceRuntimeApi(parseInt(latestReceivedNonceCallType.toString()));
    };

    const getNonceOfCurrentBlock = async () => {
      const nonce = await getNonceByHash(parseInt(bestBlockFinalizedOnTarget));
      setNonceOfCurrentTargetBlock(nonce);
    };

    getNonceOfCurrentBlock();
    getLatestReceivedNonce();
  }, [
    areApiLoading,
    bestBlockFinalizedOnTarget,
    transaction,
    laneId,
    latestReceivedNonceMethodName,
    targetApi.registry,
    targetApi.rpc.chain,
    targetApi.rpc.state,
    setLatestReceivedNonceRuntimeApi,
    getNonceByHash,
    setNonceOfCurrentTargetBlock
  ]);

  return { getNonceByHash, latestReceivedNonceRuntimeApi, nonceOfCurrentTargetBlock };
};

export default useTransactionNonces;
