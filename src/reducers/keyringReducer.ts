// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
