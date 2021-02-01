// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext } from 'react';

import { SOURCE } from '../constants';
import { useProvider } from '../hooks/useProvider';
import { ApiPromiseContextType } from '../types/sourceTargetTypes';
import { ApiPromiseContextProvider } from './ApiPromiseContextProvider';

interface ApiRxContextSourceProviderProps {
  children: React.ReactElement
}

export const ApiPromiseSourceContext: React.Context<ApiPromiseContextType> = React.createContext({} as ApiPromiseContextType);

export function useApiSourcePromiseContext() {
	return useContext(ApiPromiseSourceContext);
}

export function ApiPromiseSourceContextProvider(
	props: ApiRxContextSourceProviderProps
): React.ReactElement {
	const { children  } = props;
	const provider = useProvider(SOURCE);

	return (
		<ApiPromiseContextProvider contextType={SOURCE} ApiPromiseContext={ApiPromiseSourceContext} provider={provider}>
			{children}
		</ApiPromiseContextProvider>
	);

}