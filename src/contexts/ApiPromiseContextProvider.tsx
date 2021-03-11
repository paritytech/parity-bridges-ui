// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//copied over from @substrate/context This needs to be updated.

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
