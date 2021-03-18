// Copyright 2019-2020 Parity Technologies (UK) Ltd.
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
import { ApiOptions } from '@polkadot/api/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { TypeRegistry } from '@polkadot/types';
import React, { useEffect, useState } from 'react';

import { ApiPromiseContextType } from '../types/sourceTargetTypes';
import { useDidUpdateEffect } from '../util/useDidUpdateEffect';
import { useSourceTarget } from './SourceTargetContextProvider';

export interface ApiRxContextProviderProps {
  children?: React.ReactElement;
  provider: ProviderInterface;
  ApiPromiseContext: React.Context<ApiPromiseContextType>;
  contextType: string;
  types?: ApiOptions['types'];
  hasher?: ApiOptions['hasher'];
}

const registry = new TypeRegistry();

export function ApiPromiseContextProvider(props: ApiRxContextProviderProps): React.ReactElement {
  const { children = null, provider, ApiPromiseContext, contextType, types, hasher } = props;
  const sourceTarget = useSourceTarget();
  const options = { hasher, provider, types };
  const [apiPromise, setApiPromise] = useState<ApiPromise>(new ApiPromise(options));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      setIsReady(false);
      apiPromise.disconnect().then(() => console.log(`${contextType} Resetting connection`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceTarget]);

  useDidUpdateEffect(() => {
    ApiPromise.create(options).then((_api) => {
      setApiPromise(_api);
    });
  }, [provider]);

  useEffect(() => {
    apiPromise.isReady.then(() => {
      if (types) {
        registry.register(types);
      }

      setIsReady(true);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPromise.isReady]);

  return (
    <ApiPromiseContext.Provider value={{ api: apiPromise, isApiReady: isReady }}>{children}</ApiPromiseContext.Provider>
  );
}
