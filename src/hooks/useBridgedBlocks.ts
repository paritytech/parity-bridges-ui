// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import BN from 'bn.js';
import { useEffect, useState } from 'react';

interface HeaderId{
	number: BN,
	hash: Hash
}

type CodecHeaderId = Codec & HeaderId;
// type CodecBestBloc = Codec & [HeaderId, any]

interface Props {
  chain: string,
  api: ApiPromise,
  isApiReady: boolean
}

const useBridgedBlocks = ({  isApiReady, api ,chain }: Props) => {
	const [bestBridgedFinalizedBlock, setBestBridgedFinalizedBlock] = useState('');
	const [bestBridgedHeight, setBestBridgedHeight] = useState('');
	const [importedHeaders, setImportedHeaders] = useState('');

	useEffect(() => {
		if(!api || !isApiReady){
			return;
		}

		const bridgedChain = `bridge${chain}`;

		api.query[bridgedChain].bestFinalized((res: CodecHeaderId) => {
			setBestBridgedFinalizedBlock(res.toString());
		});

		api.query[bridgedChain].bestHeight((res: CodecHeaderId) => {
			setBestBridgedHeight(res.toString());
		});

		if (chain === 'Rialto') {
			console.log('res chain', chain);
			if (bestBridgedFinalizedBlock !== '') {
				api.query[bridgedChain].importedHeaders(bestBridgedFinalizedBlock, (res: any) => {
					setImportedHeaders(res.toJSON().header.number);
				});
			}

		}

	},[api,isApiReady, chain,bestBridgedHeight]);

	return { bestBridgedFinalizedBlock,bestBridgedHeight,importedHeaders };
};

export default useBridgedBlocks;