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

//copied over from @substrate/context This needs to be updated.

import { ApiPromise } from '@polkadot/api';
/* import { ApiOptions } from '@polkadot/api/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types'; */
import { TypeRegistry } from '@polkadot/types';
import React, { useEffect, useState } from 'react';

import { getChainConfigs } from '../configs/substrateProviders';
import { ApiPromiseConnectionType } from '../types/sourceTargetTypes';
import { useDidUpdateEffect } from '../util/useDidUpdateEffect';

export interface ApiRxProviderProps {
  chain: string;
}

export const ApiPromiseContext: React.Context<ApiPromiseConnectionType> = React.createContext(
  {} as ApiPromiseConnectionType
);

const registry = new TypeRegistry();

export function useApiConnection(chain: string): ApiPromiseConnectionType {
  const configs = getChainConfigs();
  const { hasher, provider, types } = configs[chain];
  const options = { hasher, provider, types };
  const [apiPromise, setApiPromise] = useState<ApiPromise>(new ApiPromise(options));
  const [isReady, setIsReady] = useState(false);

  useDidUpdateEffect(() => {
    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    setApiPromise(new ApiPromise(options));

    setIsReady(false);
  }, [provider]);

  useEffect(() => {
    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    apiPromise.isReady.then(() => {
      if (types) {
        registry.register(types);
      }
      console.log('Api ready.');
      setIsReady(true);
    });
  }, [apiPromise.isReady, types]);

  return { api: apiPromise, isApiReady: isReady };
}
