// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { KeyringPair } from '@polkadot/keyring/types';

import KeyringActions from '../actions/keyringActions';
export interface KeyringContextType {
  keyringPairs: Array<KeyringPair>;
  keyringPairsReady: boolean;
}

interface Payload {
  [propName: string]: any; // change this type
}

export interface KeyringState {
  keyring: any;
  keyringStatus: string | null;
}

export type KeyringAction = { type: KeyringActions; payload?: Payload };
