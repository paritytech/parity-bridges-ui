// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext } from 'react';

import { TARGET } from '../constants';
import { useProvider } from '../hooks/useProvider';
import { ApiPromiseContextType } from '../types/sourceTargetTypes';
import { ApiPromiseContextProvider } from './ApiPromiseContextProvider';

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
	const { children  } = props;
	const provider = useProvider(TARGET);

	return (
		<ApiPromiseContextProvider contextType={TARGET} ApiPromiseContext={ApiPromiseTargetContext} provider={provider}>
			{children}
		</ApiPromiseContextProvider>
	);

}