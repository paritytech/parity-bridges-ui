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
import { useMountedState } from '../react/useMountedState';
import getSubstrateDynamicNames from '../../util/getSubstrateDynamicNames';
import { useApiSubscription } from './useApiSubscription';
import { getBridgedBlocks } from '../../api/getBridgedBlocks';

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

  useApiSubscription(getBestFinalizedBlock, isReady);
  useApiSubscription(getBestBridgedFinalizedBlock, isReady && Boolean(bestFinalizedBlock));

  return { bestBridgedFinalizedBlock };
};

export default useBridgedBlocks;
