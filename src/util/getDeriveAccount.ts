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

import { compactAddLength, stringToU8a } from '@polkadot/util';
import { blake2AsHex, decodeAddress, encodeAddress } from '@polkadot/util-crypto';

const accountDerivation = 'pallet-bridge/account-derivation/account';

interface Data {
  ss58Format: number;
  bridgeId: number[];
  address: string;
}

export default function getDeriveAccount({ ss58Format = 42, bridgeId, address }: Data): string {
  const input = [...compactAddLength(stringToU8a(accountDerivation)), ...bridgeId, ...decodeAddress(address)];
  return encodeAddress(blake2AsHex(Uint8Array.from(input)), ss58Format);
}
