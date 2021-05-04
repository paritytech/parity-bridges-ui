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

import { u8aConcat } from '@polkadot/util';
import { blake2AsU8a, keccakAsU8a } from '@polkadot/util-crypto';

type Hasher = { [index: string]: (data: Uint8Array) => Uint8Array } | undefined;

function blake2Keccak256Concat(data: Uint8Array) {
  return u8aConcat(blake2AsU8a(data), keccakAsU8a(data));
}

const hashers: Hasher = {
  blake2Keccak256Concat
};

export default hashers;
