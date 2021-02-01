// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//copied over from @substrate/context This needs to be updated.

import { ApiPromise } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { TypeRegistry } from '@polkadot/types';
import React, { useEffect, useState } from 'react';

import { SOURCE } from '../constants';
import types from '../customTypes';
import { ApiPromiseContextType } from '../types/sourceTargetTypes';
import { useDidUpdateEffect } from '../util/useDidUpdateEffect';

export interface ApiRxContextProviderProps {
  children?: React.ReactElement;
  provider: ProviderInterface;
  ApiPromiseContext: React.Context<ApiPromiseContextType>
  contextType: string
}

const registry = new TypeRegistry();

export function ApiPromiseContextProvider(
	props: ApiRxContextProviderProps
): React.ReactElement {
	const { children = null, provider, ApiPromiseContext, contextType } = props;
	const [apiPromise, setApiPromise] = useState<ApiPromise>(
		new ApiPromise({ provider, types })
	);
	const [isReady, setIsReady] = useState(false);

	useDidUpdateEffect(() => {
		// We want to fetch all the information again each time we reconnect. We
		// might be connecting to a different node, or the node might have changed
		// settings.
		setApiPromise(new ApiPromise({ provider, types }));

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
			console.log(`${contextType} Api ready.`);
			setIsReady(true);
		});
	}, [apiPromise.isReady]);

	if (contextType === SOURCE) {
		return (<ApiPromiseContext.Provider
			value={{ isSourceApiReady: isReady, sourceApi: apiPromise }}
		>
			{children}
		</ApiPromiseContext.Provider>);
	}

	return (
		<ApiPromiseContext.Provider
			value={{ isTargetApiReady: isReady, targetApi: apiPromise }}
		>
			{children}
		</ApiPromiseContext.Provider>
	);
}