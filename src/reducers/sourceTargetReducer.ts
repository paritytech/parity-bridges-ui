// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Actions from '../actions/actionTypes';
import type { SourceTarget, SourceTargetAction } from '../types/sourceTargetTypes';

const validateChange = (input1: string, input2: string) => {
	if (input1 === input2) {
		throw new Error('Source & Target chains must be different');
	}
};

export default function sourceTargetReducer(state: SourceTarget, action: SourceTargetAction): SourceTarget {
	switch (action.type) {
	case Actions.CHANGE_SOURCE: {
		validateChange(action.payload.sourceChain, state.targetChain);
		return { ...state, sourceChain: action.payload.sourceChain };
	}
	case Actions.CHANGE_TARGET: {
		validateChange(action.payload.targetChain, state.sourceChain);
		return { ...state, targetChain: action.payload.targetChain };
	}
	case Actions.SWITCH_CHAINS: {
		validateChange(action.payload.targetChain, state.sourceChain);
		return { ...state, sourceChain: state.targetChain,targetChain: state.sourceChain };
	}
	default: {
		throw new Error(`Unhandled type: ${action.type}`);
	}
	}
}