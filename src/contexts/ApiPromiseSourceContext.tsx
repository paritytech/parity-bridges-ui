// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//copied over from @substrate/context This needs to be updated.

import { ApiPromise } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { TypeRegistry } from '@polkadot/types';
import React, { useEffect, useState } from 'react';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { getProvider } from '../util/substrateProviders';
import { useDidUpdateEffect } from '../util/useDidUpdateEffect';

export interface ApiRxContextSourceProviderProps {
  children?: React.ReactElement;
	//provider: ProviderInterface;
  types?: ApiOptions['types'];
}

export interface ApiPromiseSourceContextType {
  sourceApi: ApiPromise; // From @polkadot/api\
  isSourceApiReady: boolean;
}

export const ApiPromiseSourceContext: React.Context<ApiPromiseSourceContextType> = React.createContext(
  {} as ApiPromiseSourceContextType
);

const registry = new TypeRegistry();

export function ApiPromiseSourceContextProvider(
	props: ApiRxContextSourceProviderProps
): React.ReactElement {
	const { children = null, types } = props;
	const {
		sourceChain
	} = useSourceTarget();
	const [provider, setProvider] = useState<ProviderInterface>();
	const [apiPromise, setApiPromise] = useState<ApiPromise>(
		new ApiPromise({ provider: getProvider(sourceChain) , types })
	);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		setProvider(getProvider(sourceChain));
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
			console.log('Source Api ready.');
			setIsReady(true);
		});
	}, [apiPromise.isReady, types]);

	return (
		<ApiPromiseSourceContext.Provider
			value={{ isSourceApiReady: isReady, sourceApi: apiPromise }}
		>
			{children}
		</ApiPromiseSourceContext.Provider>
	);
}