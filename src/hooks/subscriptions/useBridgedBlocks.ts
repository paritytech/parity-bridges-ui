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

import { useCallback } from 'react';
import { SubscriptionInput } from '../../types/subscriptionsTypes';
// import { Hash } from '@polkadot/types/interfaces';
// import { Codec } from '@polkadot/types/types';
// import BN from 'bn.js';
import { useMountedState } from '../react/useMountedState';
import getSubstrateDynamicNames from '../../util/getSubstrateDynamicNames';
import { useApiSubscription } from './useApiSubscription';
import { getBridgedBlocks } from '../../api/getBridgedBlocks';

// interface HeaderId {
//   number: BN;
//   hash: Hash;
// }

// type CodecHeaderId = Codec & HeaderId;

const useBridgedBlocks = ({ isApiReady, api, chain }: SubscriptionInput) => {
  const [bestBridgedFinalizedBlock, setBestBridgedFinalizedBlock] = useMountedState('');
  const [bestFinalizedBlock, setBestFinalizedBlock] = useMountedState('');
  const { bridgedGrandpaChain } = getSubstrateDynamicNames(chain);
  const isReady: boolean = !!(isApiReady && chain);

  const getBestFinalizedBlock = useCallback(
    () =>
      getBridgedBlocks({
        api,
        apiMethod: bridgedGrandpaChain,
        separator: 'bestFinalized',
        setter: setBestFinalizedBlock
      }),
    [api, bridgedGrandpaChain, setBestFinalizedBlock]
  );

  const getBestBridgedFinalizedBlock = useCallback(
    () =>
      getBridgedBlocks({
        api,
        apiMethod: bridgedGrandpaChain,
        separator: 'bestFinalizedBlock',
        setter: setBestBridgedFinalizedBlock
      }),
    [api, bridgedGrandpaChain, setBestBridgedFinalizedBlock]
  );

  // const getBestFinalizedBlock = useCallback(
  //   () =>
  //     api.query[bridgedGrandpaChain].bestFinalized((res: CodecHeaderId) => {
  //       const bestFinalized = res.toString();
  //       setBestFinalizedBlock(bestFinalized);
  //     }),
  //   [api.query, bridgedGrandpaChain, setBestFinalizedBlock]
  // );

  // const getBestBridgedFinalizedBlock = useCallback(
  //   () =>
  //     api.query[bridgedGrandpaChain].importedHeaders(bestFinalizedBlock, (res: any) => {
  //       const importedHeader = res?.toJSON()?.number;
  //       importedHeader && setBestBridgedFinalizedBlock(importedHeader);
  //     }),
  //   [api.query, bestFinalizedBlock, bridgedGrandpaChain, setBestBridgedFinalizedBlock]
  // );

  useApiSubscription(getBestFinalizedBlock, isReady);
  useApiSubscription(getBestBridgedFinalizedBlock, isReady && Boolean(bestFinalizedBlock));

  return { bestBridgedFinalizedBlock, setBestFinalizedBlock };
};

export default useBridgedBlocks;
