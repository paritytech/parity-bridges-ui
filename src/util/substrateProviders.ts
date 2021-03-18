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

import { WsProvider } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';
import { u8aConcat } from '@polkadot/util';
import { blake2AsU8a, keccakAsU8a } from '@polkadot/util-crypto';

import types from '../substrateCustomTypes';
interface Providers {
  [key: string]: string;
}

interface CustomHashers {
  [key: string]: (data: Uint8Array) => Uint8Array;
}
interface CustomTypes {
  [key: string]: ApiOptions['types'];
}

// create a custom hasher (512 bits, combo of blake2 and keccak)
function hasherH512(data: any) {
  return u8aConcat(blake2AsU8a(data), keccakAsU8a(data));
}

export const CHAIN_1 = process.env.REACT_APP_PROVIDER_NAME_1 || 'Rialto';
export const CHAIN_2 = process.env.REACT_APP_PROVIDER_NAME_2 || 'Millau';

export const CHAIN_1_SUBSTRATE_PROVIDER = process.env.REACT_APP_SUBSTRATE_PROVIDER_1 || 'wss://wss.rialto.brucke.link';
export const CHAIN_2_SUBSTRATE_PROVIDER = process.env.REACT_APP_SUBSTRATE_PROVIDER_2 || 'wss://wss.millau.brucke.link';

export const providers: Providers = {
  [CHAIN_1]: CHAIN_1_SUBSTRATE_PROVIDER,
  [CHAIN_2]: CHAIN_2_SUBSTRATE_PROVIDER
};

export const customTypes: CustomTypes = {
  [CHAIN_1]: types[CHAIN_1],
  [CHAIN_2]: types[CHAIN_2]
};

export const customHashers: CustomHashers = {
  [CHAIN_2]: hasherH512
};

export const getProvider = (chain: string) => new WsProvider(providers[chain]);
