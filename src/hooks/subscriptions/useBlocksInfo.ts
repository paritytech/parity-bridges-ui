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

import { SubscriptionInput } from '../../types/subscriptionsTypes';
import type { BlockNumber } from '@polkadot/types/interfaces';
import { useMountedState } from '../react/useMountedState';
import { useApiSubscription } from './useApiSubscription';
import { useCallback } from 'react';

const useBlocksInfo = ({ isApiReady, api, chain }: SubscriptionInput) => {
  const [bestBlock, setBestBlock] = useMountedState('');
  const [bestBlockFinalized, setBestBlockFinalized] = useMountedState('');
  const isReady = !!(isApiReady && chain);

  const getBestNumber = useCallback(
    () =>
      api.derive.chain.bestNumber((res) => {
        setBestBlock((res as BlockNumber).toString());
      }),
    [api.derive.chain, setBestBlock]
  );

  const getBestBlockFinalized = useCallback(
    () =>
      api.derive.chain.bestNumberFinalized((res) => {
        setBestBlockFinalized((res as BlockNumber).toString());
      }),
    [api.derive.chain, setBestBlockFinalized]
  );

  useApiSubscription(getBestNumber, isReady);
  useApiSubscription(getBestBlockFinalized, isReady);

  return { bestBlock, bestBlockFinalized };
};

export default useBlocksInfo;
