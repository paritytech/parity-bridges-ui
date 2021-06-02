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

import { VoidFn } from '@polkadot/api/types';
import { ApiPromise } from '@polkadot/api';
import { useEffect } from 'react';
import { useMountedState } from '../hooks/useMountedState';
import logger from '../util/logger';

interface Props {
  chain: string;
  api: ApiPromise;
  isApiReady: boolean;
}

const useBlocksInfo = ({ isApiReady, api, chain }: Props) => {
  const [bestBlock, setBestBlock] = useMountedState('');
  const [bestBlockFinalized, setBestBlockFinalized] = useMountedState('');

  useEffect(() => {
    let unsubscribeBestNumber: Promise<VoidFn>;
    let unsubscribeBestNumberFinalized: Promise<VoidFn>;

    if (!api || !isApiReady || !chain) {
      return;
    }

    try {
      unsubscribeBestNumber = api.derive.chain.bestNumber((res) => {
        setBestBlock(res.toString());
      });

      unsubscribeBestNumberFinalized = api.derive.chain.bestNumberFinalized((res) => {
        setBestBlockFinalized(res.toString());
      });
    } catch (e) {
      logger.error('error reading blocks', e);
    }

    return function cleanup() {
      unsubscribeBestNumber
        .then((u) => {
          u();
        })
        .catch((e) => logger.error('error unsubscribing bestNumber', e));
      unsubscribeBestNumberFinalized
        .then((u) => u())
        .catch((e) => logger.error('error unsubscribing bestNumberFinalized', e));
    };
  }, [api, isApiReady, chain, setBestBlock, setBestBlockFinalized]);

  return { bestBlock, bestBlockFinalized };
};

export default useBlocksInfo;
