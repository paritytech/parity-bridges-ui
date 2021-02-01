// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//copied over from @substrate/context This needs to be updated.

import { ApiPromise } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { TypeRegistry } from '@polkadot/types';
import React, { useContext,useEffect, useState } from 'react';

import { getProvider } from '../util/substrateProviders';
import { useDidUpdateEffect } from '../util/useDidUpdateEffect';
import { useSourceTarget } from './SourceTargetContextProvider';

export interface ApiRxContextTargetProviderProps {
  children?: React.ReactElement;
	//provider: ProviderInterface;
	types?: ApiOptions['types'];

}

export type ApiPromiseTargetContextType = {
targetApi: ApiPromise; // From @polkadot/api\
	isTargetApiReady: boolean;
} ;

export const ApiPromiseTargetContext: React.Context<ApiPromiseTargetContextType> = React.createContext(
  {} as ApiPromiseTargetContextType
);

export function useApiTargetPromiseContext() {
	return useContext(ApiPromiseTargetContext);
}

const registry = new TypeRegistry();

export function ApiPromiseTargetContextProvider(
	props: ApiRxContextTargetProviderProps
): React.ReactElement {
	const { children = null, types } = props;

	const {
		targetChain
	} = useSourceTarget();
	const [provider, setProvider] = useState<ProviderInterface>();
	const [apiPromise, setApiPromise] = useState<ApiPromise>(
		new ApiPromise({ provider: getProvider(targetChain) , types })
	);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		setProvider(getProvider(targetChain));
	}, []);

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
			if (types){
				registry.register(types);
			}
			console.log('Target chain Api ready.');
			setIsReady(true);
		});
	}, [apiPromise.isReady, types]);

	console.log('apiPromise',apiPromise.query.balances);

	return (
		<ApiPromiseTargetContext.Provider
			value={{ isTargetApiReady: isReady, targetApi: apiPromise }}
		>
			{children}
		</ApiPromiseTargetContext.Provider>
	);

}