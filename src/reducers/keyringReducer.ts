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

import KeyringActions from '../actions/keyringActions';
import type { KeyringAction, KeyringState } from '../types/keyringTypes';
import { KeyringStatuses } from '../types/keyringTypes';

export default function keyringReducer(state: KeyringState, action: KeyringAction): KeyringState {
  switch (action.type) {
    case KeyringActions.LOAD_KEYRING:
      return { ...state, keyringStatus: KeyringStatuses.LOADING };
    case KeyringActions.SET_KEYRING:
      return { ...state, keyringStatus: KeyringStatuses.READY };
    case KeyringActions.KEYRING_ERROR:
      return { ...state, keyringStatus: KeyringStatuses.ERROR };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
