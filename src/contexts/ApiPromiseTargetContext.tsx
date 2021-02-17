// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext } from 'react';

import { TARGET } from '../constants';
import { ApiPromiseContextType } from '../types/sourceTargetTypes';
import { customTypes, getProvider } from '../util/substrateProviders';
import { ApiPromiseContextProvider } from './ApiPromiseContextProvider';
import { useSourceTarget } from './SourceTargetContextProvider';

interface ApiRxContextTargetProviderProps {
  children: React.ReactElement
}

export const ApiPromiseTargetContext: React.Context<ApiPromiseContextType> = React.createContext({} as ApiPromiseContextType);

export function useApiTargetPromiseContext() {
	return useContext(ApiPromiseTargetContext);
}

export function ApiPromiseTargetContextProvider(
	props: ApiRxContextTargetProviderProps
): React.ReactElement {
	const { children } = props;
	const { targetChain } = useSourceTarget();
	const provider = getProvider(targetChain);
	const types= customTypes[targetChain];

	return (
		<ApiPromiseContextProvider contextType={TARGET} ApiPromiseContext={ApiPromiseTargetContext} provider={provider} types={types}>
			{children}
		</ApiPromiseContextProvider>
	);

}