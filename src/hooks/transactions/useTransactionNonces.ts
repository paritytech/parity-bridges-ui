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
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { useSubscriptionsContext } from '../../contexts/SubscriptionsContextProvider';

import useLaneId from '../chain/useLaneId';
import useLoadingApi from '../connections/useLoadingApi';
import { useMountedState } from '../react/useMountedState';
import useChainGetters from '../chain/useChainGetters';
import { isTransactionCompleted } from '../../util/transactionUtils';
import { getChainSubscriptionsKey } from '../../util/chainsUtils';
import { TransactionStatusType } from '../../types/transactionTypes';
import { getSubstrateDynamicNames } from '../../util/getSubstrateDynamicNames';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';
import type { InterfaceTypes } from '@polkadot/types/types';

interface Props {
  transaction: TransactionStatusType;
}

const useTransactionNonces = ({ transaction }: Props) => {
  const [nonceOfBestTargetBlock, setNonceOfBestTargetBlock] = useMountedState<null | number>(null);
  const [nonceOfFinalTargetBlock, setNonceOfFinalTargetBlock] = useMountedState<null | number>(null);
  const subscriptions = useSubscriptionsContext();
  const { getValuesByChain } = useChainGetters();
  const laneId = useLaneId();
  const { areApiReady } = useLoadingApi();
  const { sourceChain, targetChain } = transaction;
  const { api: targetApi } = getValuesByChain(targetChain);
  const { targetRole } = getChainSubscriptionsKey({
    useSourceTarget,
    sourceChain
  });
  const { createType, stateCall } = useApiCallsContext();

  const { bestBlockFinalized, bestBlock } = subscriptions[targetRole];

  const { latestReceivedNonceMethodName } = getSubstrateDynamicNames(sourceChain);

  useEffect(() => {
    if (!areApiReady || !transaction || !transaction || isTransactionCompleted(transaction)) {
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

      const latestReceivedNonceCallType = createType(
        targetChain as keyof InterfaceTypes,
        'MessageNonce',
        latestReceivedNonceCall
      );
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
    targetApi.rpc.chain
  ]);

  return { nonceOfBestTargetBlock, nonceOfFinalTargetBlock };
};

export default useTransactionNonces;
