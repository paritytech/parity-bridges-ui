// Copyright 2021 Parity Technologies (UK) Ltd.
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

import { SourceTargetActionsTypes } from '../actions/sourceTargetActions';
import { ChainDetails, SourceTargetAction, SourceTargetState } from '../types/sourceTargetTypes';

export default function sourceTargetReducer(state: SourceTargetState, action: SourceTargetAction): SourceTargetState {
  switch (action.type) {
    case SourceTargetActionsTypes.SWAP_CHAINS: {
      if (action.payload!.chain !== state[ChainDetails.SOURCE].chain) {
        return {
          [ChainDetails.SOURCE]: {
            apiConnection: state[ChainDetails.TARGET].apiConnection,
            configs: state[ChainDetails.TARGET].configs,
            chain: state[ChainDetails.TARGET].chain,
            polkadotjsUrl: state[ChainDetails.TARGET].polkadotjsUrl
          },
          [ChainDetails.TARGET]: {
            apiConnection: state[ChainDetails.SOURCE].apiConnection,
            chain: state[ChainDetails.SOURCE].chain,
            polkadotjsUrl: state[ChainDetails.SOURCE].polkadotjsUrl,
            configs: state[ChainDetails.SOURCE].configs
          }
        };
      }
      return state;
    }
    default: {
      throw new Error(`Unhandled type: ${action.type}`);
    }
  }
}
