// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';

import ActionsTypes from './actions/actionTypes';
import { useApiSourcePromiseContext } from './contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from './contexts/ApiPromiseTargetContext';
import { useSourceTarget, useUpdateSourceTarget } from './contexts/SourceTargetContextProvider';
import {  MILLAU } from './util/substrateProviders';

export default function Test() {
	const {
		sourceChain, targetChain
	} = useSourceTarget();
	const sourceApi = useApiSourcePromiseContext();
	const targetApi = useApiTargetPromiseContext();

	const { dispatchSourceTarget } = useUpdateSourceTarget();

	console.log('sourceApi', sourceApi);
	console.log('targetApi', targetApi);
	console.log('process.env', process.env);

	return (
		<>
			<button onClick={() => dispatchSourceTarget({ payload: { sourceChain: MILLAU },type: ActionsTypes.CHANGE_SOURCE })}> change source </button>
			<div>sourceChain: {sourceChain}</div>
			<br />
			<div>targetChain: {targetChain}</div>
		</>
	);
}