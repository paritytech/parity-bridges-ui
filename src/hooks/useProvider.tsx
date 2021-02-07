// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { useEffect, useState } from 'react';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { ChainTypes } from '../types/sourceTargetTypes';
import { getProvider } from '../util/substrateProviders';

export function useProvider(chain: ChainTypes): ProviderInterface {

	const nextChain = useSourceTarget();
	const [provider, setProvider] = useState<ProviderInterface>(getProvider(nextChain[chain]));

	useEffect(() => {
		setProvider(getProvider(nextChain[chain]));
	}, [chain,nextChain]);

	return provider;

}