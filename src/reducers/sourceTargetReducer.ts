// Copyright 2019-2020 Parity Technologies (UK) Ltd.
// This file is part of Parity Bridges UI.
//
// Parity Bridges UI is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Parity Bridges UI is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Parity Bridges UI.  If not, see <http://www.gnu.org/licenses/>.

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
      return { ...state, sourceChain: state.targetChain, targetChain: state.sourceChain };
    }
    default: {
      throw new Error(`Unhandled type: ${action.type}`);
    }
  }
}
