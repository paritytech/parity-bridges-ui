// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ActionsTypes from '../actions/actionTypes';

export interface SourceTarget {
	sourceChain: string,
	targetChain: string
}

interface Payload {
	[propName: string]: string;
}

export type SourceTargetAction = { type: ActionsTypes, payload: Payload }
