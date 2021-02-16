// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiOptions } from '@polkadot/api/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { useEffect, useState } from 'react';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { ChainTypes } from '../types/sourceTargetTypes';
import { customTypes, getProvider } from '../util/substrateProviders';

interface Output {
	provider: ProviderInterface,
	types: ApiOptions['types'];
}

export function useProvider(chain: ChainTypes): Output {

	const nextChain = useSourceTarget();
	const [provider, setProvider] = useState<ProviderInterface>(getProvider(nextChain[chain]));
	const [types, setTypes] = useState(customTypes[nextChain[chain]]);

	useEffect(() => {
		setProvider(getProvider(nextChain[chain]));
		setTypes(types);
	}, [chain, nextChain]);

	return { provider,types };

}