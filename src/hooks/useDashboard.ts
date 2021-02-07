// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { ChainTypes } from '../types/sourceTargetTypes';
import useBlocksInfo from './useBlocksInfo';
import useBridgedBlocks from './useBridgedBlocks';
import useMessagesLane from './useMessagesLane';

const useDashboard = (chainType: ChainTypes, useApi: Function) => {

	const chains = useSourceTarget();
	const chain = chains[chainType];
	const { isApiReady, api } = useApi();
	const { bestBlock,bestBlockFinalized  } = useBlocksInfo({ api, chain, isApiReady });
	const { bestBridgedFinalizedBlock,bestBridgedHeight,importedHeaders  } = useBridgedBlocks({ api, chain,isApiReady });
	const { outboundLanes } = useMessagesLane({ api, chain,isApiReady });

	return { bestBlock,bestBlockFinalized,  bestBridgedFinalizedBlock,bestBridgedHeight, importedHeaders,outboundLanes };
};

export default useDashboard;