// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import type { KeyringPair } from '@polkadot/keyring/types';

import AccountActions from '../actions/accountActions';

type Account = KeyringPair | null;

export interface AccountContextType {
  account: Account;
}

interface Payload {
  [propName: string]: Account;
}

export interface AccountState {
  account: Account;
}

export type AccountsActionType = { type: AccountActions; payload: Payload };
