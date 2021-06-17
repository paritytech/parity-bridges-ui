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
  apiMethod?: string;
  arg1?: unknown;
}

export const useApiCallAndSubscriptions = ({
  isApiReady,
  api,
  chain,
  apiFunc,
  apiMethod,
  separators,
  arg1
}: Inputs) => {
  const [state1, setstate1] = useMountedState('');
  const [state2, setstate2] = useMountedState('');

  const enrichOptions = (options: any, apiMethod: string | undefined, arg1: any) => {
    if (apiMethod) {
      options = Object.assign({}, options, { apiMethod });
    }
    if (arg1) {
      options = Object.assign({}, options, { arg1 });
    }
    return options;
  };

  const getstate1 = useCallback(() => {
    let options = {
      api,
      separator: separators[0],
      setter: setstate1
    };
    options = enrichOptions(options, apiMethod, arg1);
    return apiFunc(options);
  }, [api, separators, setstate1, apiMethod, arg1, apiFunc]);

  const getstate2 = useCallback(() => {
    let options = {
      api,
      separator: separators[1],
      setter: setstate2
    };
    if (apiMethod) {
      options = Object.assign({}, options, { apiMethod });
    }
    if (arg1) {
      options = Object.assign({}, options, { arg1 });
    }
    return apiFunc(options);
  }, [api, separators, setstate2, apiMethod, arg1, apiFunc]);

  useEffect(() => {
    const isReady = !!(isApiReady && chain);
    const unsubscribe = (unsub: Promise<VoidFn>, isReady: boolean) => {
      isReady &&
        unsub &&
        unsub
          .then((u) => typeof u === 'function' && u())
          .catch((e) => {
            logger.error('error unsubscribing', e);
          });
    };

    if (!isReady) {
      return;
    }

    try {
      const unsub1 = getstate1();
      const unsub2 = getstate2();
      return () => {
        unsubscribe(unsub1, isReady);
        unsubscribe(unsub2, isReady);
      };
    } catch (e) {
      logger.error('error executing subscription', e);
    }
  }, [chain, getstate1, getstate2, isApiReady]);

  return { state1, state2 };
};
