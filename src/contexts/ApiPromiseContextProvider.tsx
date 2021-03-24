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
import { TypeRegistry } from '@polkadot/types';
import React, { useEffect, useState } from 'react';

import { ApiPromiseContextType } from '../types/sourceTargetTypes';
import logger from '../util/logger';
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
  const [disconnected, setDisconnected] = useState(false);

  useEffect(() => {
    if (isReady) {
      logger.info(`${contextType} was changed`);
      setIsReady(false);
      setApiPromise(new ApiPromise(options));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceTarget]);

  useDidUpdateEffect(() => {
    if (!isReady && !apiPromise.isConnected) {
      apiPromise.disconnect().then(() => {
        setDisconnected(true);
        logger.info(`${contextType} Resetting connection`);
      });
    }
  }, [isReady]);

  useDidUpdateEffect(() => {
    if (!apiPromise.isConnected) {
      ApiPromise.create(options).then((_api) => {
        logger.info(`${contextType} connection recreated `);
        setApiPromise(_api);
        setDisconnected(false);
      });
    }
  }, [apiPromise.isConnected]);

  useEffect(() => {
    if (!disconnected) {
      apiPromise.isReady
        .then(() => {
          if (types) {
            registry.register(types);
          }
          logger.info(`${contextType} type registration ready`);
          setIsReady(true);
        })
        .catch((e) => logger.error(`${contextType} error in registration`, e));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPromise.isReady]);

  return (
    <ApiPromiseContext.Provider value={{ api: apiPromise, isApiReady: isReady }}>{children}</ApiPromiseContext.Provider>
  );
}
