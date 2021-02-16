// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import useBlocksInfo from './useBlocksInfo';
import useBridgedBlocks from './useBridgedBlocks';
import useMessagesLane from './useMessagesLane';

const useDashboard = ( local:string, destination:string,useApi: Function) => {
	const { isApiReady, api } = useApi();
	const blockInfo = useBlocksInfo({ api, chain:local, isApiReady });
	const bridgedBlocks= useBridgedBlocks({ api, chain:destination,isApiReady });
	const messagesLane = useMessagesLane({ api, chain:destination,isApiReady });

	return { ...blockInfo,  ...bridgedBlocks,...messagesLane };
};

export default useDashboard;