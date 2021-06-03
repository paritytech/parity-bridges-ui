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

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useSubscriptionsContext } from '../contexts/SubscriptionsContextProvider';
import { useApiCallsContext } from '../contexts/ApiCallsContextProvider';

import useLaneId from './useLaneId';
import useLoadingApi from './api/useLoadingApi';
import { useMountedState } from './useMountedState';

import { isTransactionCompleted } from '../util/transactionUtils';
import { getSourceTargetRole } from '../util/chainsUtils';
import { TransactionStatusType } from '../types/transactionTypes';
import { getSubstrateDynamicNames } from '../util/getSubstrateDynamicNames';
interface Props {
  transaction: TransactionStatusType;
}

const useTransactionNonces = ({ transaction }: Props) => {
  const [nonceOfBestTargetBlock, setNonceOfBestTargetBlock] = useMountedState<null | number>(null);
  const [nonceOfFinalTargetBlock, setNonceOfFinalTargetBlock] = useMountedState<null | number>(null);
  const subscriptions = useSubscriptionsContext();

  const laneId = useLaneId();
  const { areApiReady } = useLoadingApi();
  const { sourceChain, targetChain } = transaction;
  const { targetRole } = getSourceTargetRole({
    useSourceTarget,
    sourceChain
  });
  const { createType, stateCall, getBlockHash } = useApiCallsContext();

  const { bestBlockFinalized, bestBlock } = subscriptions[targetRole];

  const { latestReceivedNonceMethodName } = getSubstrateDynamicNames(sourceChain);

  useEffect(() => {
    if (!areApiReady || !transaction || !transaction || isTransactionCompleted(transaction)) {
      return;
    }

    const getLatestReceivedNonce = async (blockNumber: string) => {
      const blockHash = await getBlockHash(targetChain, blockNumber);
      const latestReceivedNonceCall = await stateCall(targetChain, laneId, blockHash.toJSON());

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
    areApiReady,
    transaction,
    laneId,
    latestReceivedNonceMethodName,
    setNonceOfBestTargetBlock,
    setNonceOfFinalTargetBlock,
    bestBlock,
    bestBlockFinalized,
    stateCall,
    targetChain,
    createType,
    getBlockHash
  ]);

  return { nonceOfBestTargetBlock, nonceOfFinalTargetBlock };
};

export default useTransactionNonces;
