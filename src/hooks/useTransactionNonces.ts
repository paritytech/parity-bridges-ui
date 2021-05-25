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

import { useEffect } from 'react';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useOnChainValuesContext } from '../contexts/OnChainValuesContextProvider';

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
  const [nonceOfBestTargetBlock, setNonceOfBestTargetBlock] = useMountedState<null | number>(null);
  const [nonceOfFinalTargetBlock, setNonceOfFinalTargetBlock] = useMountedState<null | number>(null);
  const onChainValues = useOnChainValuesContext();

  const { getValuesByChain } = useChainGetters();

  const laneId = useLaneId();
  const { areApiReady } = useLoadingApi();
  const { sourceChain, targetChain } = transaction;
  const { targetRole } = getSourceTargetRole({
    useSourceTarget,
    sourceChain
  });

  const { bestBlockFinalized, bestBlock } = onChainValues[targetRole];

  const { latestReceivedNonceMethodName } = getSubstrateDynamicNames(sourceChain);
  const { api: targetApi } = getValuesByChain(targetChain);

  useEffect(() => {
    if (!areApiReady || !transaction || !transaction || isTransactionCompleted(transaction)) {
      return;
    }

    const getLatestReceivedNonce = async (blockNumber: string) => {
      const blockHash = await targetApi.rpc.chain.getBlockHash(blockNumber);
      const latestReceivedNonceCall = await targetApi.rpc.state.call<Codec>(
        latestReceivedNonceMethodName,
        laneId,
        blockHash.toJSON()
      );

      // @ts-ignore
      const latestReceivedNonceCallType = targetApi.registry.createType('MessageNonce', latestReceivedNonceCall);
      const latestReceivedNonce = latestReceivedNonceCallType.toString();
      return parseInt(latestReceivedNonce);
    };

    const updateNonces = async () => {
      const finalizedNonce = getLatestReceivedNonce(bestBlockFinalized);
      const bestNonce = getLatestReceivedNonce(bestBlock);

      setNonceOfBestTargetBlock(await bestNonce);
      setNonceOfFinalTargetBlock(await finalizedNonce);
    };

    updateNonces();
  }, [
    areApiReady,
    transaction,
    laneId,
    latestReceivedNonceMethodName,
    targetApi.registry,
    targetApi.rpc.chain,
    targetApi.rpc.state,
    setNonceOfBestTargetBlock,
    setNonceOfFinalTargetBlock,
    bestBlock,
    bestBlockFinalized
  ]);

  return { nonceOfBestTargetBlock, nonceOfFinalTargetBlock };
};

export default useTransactionNonces;
