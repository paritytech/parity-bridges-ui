<<<<<<< HEAD
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
=======
// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
>>>>>>> d588473 (Account selector integrated with remark test component)

import type { KeyringPair } from '@polkadot/keyring/types';

import AccountActions from '../actions/accountActions';

type Account = KeyringPair | null;

export interface AccountContextType {
  account: Account;
}

interface Payload {
<<<<<<< HEAD
  [propName: string]: Account;
=======
  [propName: string]: Account; // change this type
>>>>>>> d588473 (Account selector integrated with remark test component)
}

export interface AccountState {
  account: Account;
}

export type AccountsActionType = { type: AccountActions; payload: Payload };
