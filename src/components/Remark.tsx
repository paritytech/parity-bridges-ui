// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Keyring from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import React from 'react';
import { Button, Container } from 'semantic-ui-react';
import styled from 'styled-components';

import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
//import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import useLoadingApi from '../hooks/useLoadingApi';

interface Props {
    className? : string
}

const Remark = ({
	className
}: Props) => {
	const { api: sourceApi } = useApiSourcePromiseContext();
	//const { api: targetApi } = useApiTargetPromiseContext();
	const areApiLoading = useLoadingApi();

	async function sendRemark() {

		const keyring = new Keyring({  type: 'sr25519' });
		const account = keyring.addFromUri('//Alice');
		keyring.setSS58Format(42);
		console.log('account', account);

		const lane_id = new Uint8Array(8);
		const payload = {
			call: [4, 1, 84, 85, 110, 105, 120, 32, 116, 105, 109, 101, 58, 32, 49, 54, 49, 52, 50, 54, 48, 51, 50, 50],
			origin: {
				SourceAccount: account.addressRaw
			},
			spec_version: 1,
			weight: 5279000
		};

		// @ts-ignore
		const callOriginType = sourceApi.registry.createType('CallOrigin', { SourceAccount: account.addressRaw });

		console.log('callOriginType', callOriginType.toString());
		console.log('callOriginType encoded',u8aToHex(callOriginType.toU8a()));

		// @ts-ignore
		const payloadType = sourceApi.registry.createType('OutboundPayload', payload);

		console.log('payloadType',u8aToHex(payloadType.toU8a()));

		console.log('payload', payload);
		// @ts-ignore
		const messagePayloadType = sourceApi.registry.createType('MessageData', { fee:3576409240,payload:payloadType });
		console.log('messagePayloadType', u8aToHex(messagePayloadType.toU8a()) );

		const bridgeMessage = sourceApi.tx
			.bridgeMillauMessageLane
			.sendMessage(lane_id, payload, 6576409240);

		console.log('bridgeMessage', u8aToHex(bridgeMessage.toU8a()));

		const noncePromise = await sourceApi.rpc.system.accountNextIndex(account.address);

		const nonce = noncePromise.toNumber();

		const result = await bridgeMessage.signAndSend(account, { nonce });
		console.log('result',result);
		console.log('encoded result', u8aToHex(result.toU8a()));

		// no blockHash is specified, so we retrieve the latest
		const signedBlock = await sourceApi.rpc.chain.getBlock();
		const allRecords = await sourceApi.query.system.events.at(signedBlock.block.header.hash);

		// map between the extrinsics and events
		signedBlock.block.extrinsics.forEach(({ method: { method, section } }) => {
			// filter the specific events based on the phase and then the
			// index of our extrinsic in the block
			const events = allRecords.map(({ event }) => `${event.section}.${event.method}`);

			console.log(`${section}.${method}:: ${events.join(', ') || 'no events'}`);
		});

	}

	if (!areApiLoading) {
		return null;
	}

	return (
		<Container className={className}>
			<Button onClick={() => sendRemark()}>Remark</Button>
		</Container>);

};

export default styled(Remark)`
		display: flex !important;
		justify-content: center !important;
`;

