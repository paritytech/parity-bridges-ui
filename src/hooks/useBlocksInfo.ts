// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { useEffect, useState } from 'react';

interface Props {
  chain: string,
  api: ApiPromise,
  isApiReady: boolean
}

const useBlocksInfo = ({  isApiReady, api ,chain }: Props) => {

	const [bestBlock, setBestBlock] = useState('');
	const [bestBlockFinalized, setBestBlockFinalized] = useState('');

	useEffect(() => {
		if(!api || !isApiReady){
			return;
		}

		api.derive.chain.bestNumber((res) => {
			setBestBlock(res.toString());
		});

		api.derive.chain.bestNumberFinalized((res) => {
			setBestBlockFinalized(res.toString());
		});

	}, [api, isApiReady, chain]);

	useEffect(() => {
		if(!isApiReady){
			setBestBlock('');
			setBestBlockFinalized('');

		}
	}, [isApiReady]);

	return { bestBlock,bestBlockFinalized };
};

export default useBlocksInfo;