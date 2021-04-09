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

/* eslint-disable @typescript-eslint/no-unused-vars */

import { ApiPromise } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
/* import { ApiOptions } from '@polkadot/api/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types'; */
import { TypeRegistry } from '@polkadot/types';
import React, { useEffect, useState } from 'react';

import { ApiPromiseConnectionType } from '../types/sourceTargetTypes';

export interface ApiRxProviderProps {
  hasher?: (data: Uint8Array) => Uint8Array;
  provider: ProviderInterface;
  types?: ApiOptions['types'];
}

export const ApiPromiseContext: React.Context<ApiPromiseConnectionType> = React.createContext(
  {} as ApiPromiseConnectionType
);

const registry = new TypeRegistry();

export function useApiConnection({ hasher, provider, types }: ApiRxProviderProps): ApiPromiseConnectionType {
  const [apiPromise, setApiPromise] = useState<ApiPromise>({} as ApiPromise);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    ApiPromise.create({ hasher, provider, types })
      .then((api): void => {
        setApiPromise(api);
      })
      .catch((err): void => {
        console.error(err);
      });
  }, [hasher, provider, types]);

  useEffect(() => {
    !isReady &&
      apiPromise &&
      apiPromise.isReady &&
      apiPromise.isReady.then(() => {
        if (types) {
          registry.register(types);
        }
        setIsReady(true);
      });
  }, [apiPromise, isReady, types]);

  return { api: apiPromise, isApiReady: isReady };
}
