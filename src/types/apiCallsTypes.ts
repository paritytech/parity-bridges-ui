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

import type { Registry } from '@polkadot/types/types';
import type { Bytes } from '@polkadot/types/primitive';

import type { BlockHash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

export type CreateType = Registry['createType'];

export type StateCall = (
  chain: string,
  methodName: string,
  data: Bytes | string | Uint8Array,
  at?: BlockHash | string | Uint8Array
) => Promise<Codec>;

export interface ApiCallsContextType {
  createType: CreateType;
  stateCall: StateCall;
  updateSenderBalances: () => void;
}
