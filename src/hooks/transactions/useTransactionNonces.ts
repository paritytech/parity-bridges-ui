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

import { useEffect } from 'react';
import { useOverrideSourceTargetContext } from '../../components/OverrideSourceTarget';
import useLaneId from '../chain/useLaneId';
import { useMountedState } from '../react/useMountedState';
import { isTransactionCompleted } from '../../util/transactionUtils';
import { getSubstrateDynamicNames } from '../../util/getSubstrateDynamicNames';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';

const useTransactionNonces = () => {
  const [nonceOfBestTargetBlock, setNonceOfBestTargetBlock] = useMountedState<null | number>(null);
  const [nonceOfFinalTargetBlock, setNonceOfFinalTargetBlock] = useMountedState<null | number>(null);
  const { targetApi, transaction, targetSubscriptions } = useOverrideSourceTargetContext();

  const laneId = useLaneId();
  const { sourceChain, targetChain } = transaction;
  const { createType, stateCall } = useApiCallsContext();
  const { bestBlockFinalized, bestBlock } = targetSubscriptions;
  const { latestReceivedNonceMethodName } = getSubstrateDynamicNames(sourceChain);

  useEffect(() => {
    if (!transaction || isTransactionCompleted(transaction)) {
      return;
    }

    const getLatestReceivedNonce = async (blockNumber: string) => {
      const blockHash = await targetApi.rpc.chain.getBlockHash(blockNumber);
      const latestReceivedNonceCall = await stateCall(
        targetChain,
        latestReceivedNonceMethodName,
        laneId,
        blockHash.toJSON()
      );

      // @ts-ignore
      const latestReceivedNonceCallType = createType(targetChain, 'MessageNonce', latestReceivedNonceCall);
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
    bestBlock,
    bestBlockFinalized,
    createType,
    laneId,
    latestReceivedNonceMethodName,
    setNonceOfBestTargetBlock,
    setNonceOfFinalTargetBlock,
    stateCall,
    targetApi.rpc.chain,
    targetChain,
    transaction
  ]);

  return { nonceOfBestTargetBlock, nonceOfFinalTargetBlock };
};

export default useTransactionNonces;
