// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Card } from 'semantic-ui-react';

import ActionsTypes from './actions/actionTypes';
import { SOURCE,TARGET } from './constants';
import { useApiSourcePromiseContext } from './contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from './contexts/ApiPromiseTargetContext';
import { useSourceTarget, useUpdateSourceTarget } from './contexts/SourceTargetContextProvider';
import useDashboard from './hooks/useDashboard';
import { MILLAU } from './util/substrateProviders';

//type CodecHeaderId = Codec & HeaderId;

export default function Test() {
	const {
		sourceChain, targetChain
	} = useSourceTarget();

	const { bestBlockFinalized: bestSourceBlockFinalized, bestBlock: bestSourceBlock, importedHeaders: bestTargetBridgedFinalizedBlock,  outboundLanes  } = useDashboard(TARGET,useApiSourcePromiseContext);
	const { bestBlockFinalized: bestTargetBlockFinalized, bestBlock: bestTargetBlock, importedHeaders: bestSourceBridgedFinalizedBlock  } = useDashboard(SOURCE,useApiTargetPromiseContext);

	const { dispatchSourceTarget } = useUpdateSourceTarget();

	return (
		<>
			<button onClick={() => dispatchSourceTarget({ payload: { sourceChain: MILLAU },type: ActionsTypes.CHANGE_SOURCE })}> change source </button>
			<div>sourceChain: {sourceChain}</div>
			<br />
			<div>targetChain: {targetChain}</div>
			<br />

			<Card style={{ 'wordWrap': 'break-word' }}>
				<Card.Content header={`Source: ${sourceChain}`} />
				<Card.Description>
					<div>Best Block: {bestSourceBlock}</div>
					<div>Best Finalized block: {bestSourceBlockFinalized}</div>
					<hr style={{ 'maxWidth': '80%' }} />
					<div>Best Target Finalized block: {bestTargetBridgedFinalizedBlock}</div>
					<div>Outboundlanes: {outboundLanes}</div>
				</Card.Description>
				<Card.Content extra>
				</Card.Content>
			</Card>

			<Card style={{ 'wordWrap': 'break-word' }}>
				<Card.Content header={`Target: ${targetChain}`} />
				<Card.Description>
					<div>Best Block: {bestTargetBlock}</div>
					<div>Best Finalized block: {bestTargetBlockFinalized}</div>
					<hr style={{ 'maxWidth': '80%' }} />
					<div>Best Source Finalized block: {bestSourceBridgedFinalizedBlock}</div>
				</Card.Description>
				<Card.Content extra>
				</Card.Content>
			</Card>

		</>
	);
}