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
import { ApiPromise } from '@polkadot/api';
import { VoidFn } from '@polkadot/api/types';
import { useMountedState } from '../hooks/react/useMountedState';
import { useCallback, useEffect } from 'react';
import logger from '../util/logger';
import { DataType } from './types';

export interface Inputs {
  chain: string;
  api: ApiPromise;
  isApiReady: boolean;
  apiFunc: (options: DataType) => Promise<VoidFn>;
  separators: string[];
}

export const useApiCallAndSubscriptions = ({ isApiReady, api, chain, apiFunc, separators }: Inputs) => {
  const [state1, setstate1] = useMountedState('');
  const [state2, setstate2] = useMountedState('');

  const getstate1 = useCallback(
    () =>
      apiFunc({
        api,
        separator: separators[0],
        setter: setstate1
      }),
    [api, apiFunc, separators, setstate1]
  );

  const getstate2 = useCallback(
    () =>
      apiFunc({
        api,
        separator: separators[1],
        setter: setstate2
      }),
    [api, apiFunc, separators, setstate2]
  );

  useEffect(() => {
    const isReady = !!(isApiReady && chain);

    if (!isReady) {
      return;
    }

    try {
      const unsub1 = getstate1();
      const unsub2 = getstate2();
      return () => {
        isReady &&
          unsub1 &&
          unsub1
            .then((u) => u())
            .catch((e) => {
              logger.error('error unsubscribing', e);
            });
        isReady &&
          unsub2 &&
          unsub2
            .then((u) => u())
            .catch((e) => {
              logger.error('error unsubscribing', e);
            });
      };
    } catch (e) {
      logger.error('error executing subscription', e);
    }
  }, [chain, getstate1, getstate2, isApiReady]);

  return { state1, state2 };
};
