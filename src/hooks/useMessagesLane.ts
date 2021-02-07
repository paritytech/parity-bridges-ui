// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
//import { Hash } from '@polkadot/types/interfaces';
//import { Codec } from '@polkadot/types/types';
//import BN from 'bn.js';
import { useEffect, useState } from 'react';

/* interface HeaderId{
	number: BN,
	hash: Hash
} */

//type CodecHeaderId = Codec & HeaderId;
// type CodecBestBloc = Codec & [HeaderId, any]

interface Props {
  chain: string,
  api: ApiPromise,
  isApiReady: boolean
}

const useBlocksInfo = ({  isApiReady, api ,chain }: Props) => {
	const [outboundLanes, setOutboudLanes] = useState('');

	useEffect(() => {
		if(!api || !isApiReady){
			return;
		}

		const bridgedMessagesLainChain = `bridge${chain}MessageLane`;
		// to-do: review after depending on action to perform
		api.query[bridgedMessagesLainChain].outboundLanes('0x00000000', (res: any) => {
			console.log('res outboundLanes',res);

			console.log('res outboundLanes',res.get('latest_generated_nonce').toJSON());
			setOutboudLanes(res.toString());
		});

		api.query[bridgedMessagesLainChain].inboundLanes('0x00000000', (res: any) => {
			console.log('res inboundLanes',res);
			/*
			console.log('res outboundLanes',res.get('latest_generated_nonce').toJSON());
			setOutboudLanes(res.toString()); */
		});

	},[api,isApiReady, chain]);

	return { outboundLanes };
};

export default useBlocksInfo;