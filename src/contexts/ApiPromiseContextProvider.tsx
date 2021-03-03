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
}

const registry = new TypeRegistry();

export function ApiPromiseContextProvider(props: ApiRxContextProviderProps): React.ReactElement {
  const { children = null, provider, ApiPromiseContext, contextType, types } = props;
  /* const rpc = {
		bridgeMillauMessageLane: {
			sendMessage: {
				description: 'Send Message over the lane',
				params: [
					{
						name: 'lane_id',
						type: 'LaneId'
					},
					{
						name: 'payload',
						type: 'OutboundPayload'
					},
					{
						name: 'delivery_and_dispatch_fee',
						type: 'OutboundMessageFee'
					}
				],
				type: 'Balance'
			}
		}
	}; */

  const sourceTarget = useSourceTarget();
  const [apiPromise, setApiPromise] = useState<ApiPromise>(new ApiPromise({ provider, types }));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      setIsReady(false);
      apiPromise.disconnect().then(() => console.log(`${contextType} Resetting connection`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceTarget]);

  useDidUpdateEffect(() => {
    ApiPromise.create({ provider, types }).then((_api) => {
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
