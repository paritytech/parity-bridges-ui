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

import { ChainDetails } from '../../types/sourceTargetTypes';
import { Subscriptions } from '../../types/subscriptionsTypes';
import useChainProfile from '../chain/useChainProfile';
import { getBlocksInfo } from '../../api/getBlocksInfo';
import { getBridgedBlocks } from '../../api/getBridgedBlocks';
// import { getLaneData } from '../../api/getLaneData';
import { useApiCallAndSubscriptions } from '../../api/useApiCallAndSubscriptions';

/**
 * These are needed in case I want to roll back to previews solutions of `useBlocksInfo` style
 */
// import useBlocksInfo from './useBlocksInfo';
// import useBridgedBlocks from './useBridgedBlocks';
import useMessagesLane from './useMessagesLane';
interface Source {
  source: string;
  polkadotjsUrl: string;
}

type Output = Subscriptions & Source;

const useSubscriptions = (ChainDetail: ChainDetails): Output => {
  const {
    apiConnection: { api, isApiReady },
    target,
    source,
    polkadotjsUrl
  } = useChainProfile(ChainDetail);

  /**
   * These are needed in case I want to roll back to previews solutions of `useBlocksInfo` style
   */
  // const blockInfo = useBlocksInfo({ api, chain: source, isApiReady });
  // const { bestBridgedFinalizedBlock } = useBridgedBlocks({ api, chain: target, isApiReady });
  // const messagesLane = useMessagesLane({ api, chain: target, isApiReady });

  const blocks = useApiCallAndSubscriptions({
    isApiReady,
    api,
    chain: source,
    apiFunc: getBlocksInfo,
    separators: ['bestNumber', 'bestNumberinalized']
  });

  const bestBlock = blocks.state1;
  const bestBlockFinalized = blocks.state2;

  const bridgedBlocks = useApiCallAndSubscriptions({
    isApiReady,
    api,
    chain: target,
    apiFunc: getBridgedBlocks,
    separators: ['bestFinalized', 'bestFinalizedBlock']
  });

  const bestBridgedFinalizedBlock = bridgedBlocks.state2;

  const messagesLane = useMessagesLane({ api, chain: target, isApiReady });
  const { outboundLanes, bridgeReceivedMessages } = messagesLane;
  // const msgLane = useApiCallAndSubscriptions({
  //   isApiReady,
  //   api,
  //   chain: target,
  //   apiFunc: getLaneData,
  //   separators: ['outbound', 'inbound']
  // });

  // const outboundLanes = JSON.parse(msgLane.state1);
  // const bridgeReceivedMessages = msgLane.state2;

  return {
    bestBlock,
    bestBlockFinalized,
    bestBridgedFinalizedBlock,
    bridgeReceivedMessages,
    outboundLanes,
    source,
    polkadotjsUrl
  };
};

export default useSubscriptions;
