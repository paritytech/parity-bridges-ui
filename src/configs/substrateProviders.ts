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
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { u8aConcat } from '@polkadot/util';
import { blake2AsU8a, keccakAsU8a } from '@polkadot/util-crypto';

import customTypesMillau from './substrateCustomTypes/customTypesMillau.json';
import customTypesRialto from './substrateCustomTypes/customTypesRialto.json';

type CustomHasher = (data: Uint8Array) => Uint8Array;

interface ChainConfig {
  bridgeId: string;
  hasher?: CustomHasher;
  types: ApiOptions['types'];
  SS58Format: number;
  provider: ProviderInterface;
}

interface ChainConfigs {
  [chain: string]: ChainConfig;
}

// create a custom hasher (512 bits, combo of blake2 and keccak)
function hasherH512(data: any) {
  return u8aConcat(blake2AsU8a(data), keccakAsU8a(data));
}

export const CHAIN_1 = process.env.CHAIN_1 || 'Rialto';
export const CHAIN_2 = process.env.CHAIN_2 || 'Millau';

export const RIALTO_SUBSTRATE_PROVIDER =
  process.env.REACT_APP_RIALTO_SUBSTRATE_PROVIDER || 'wss://wss.rialto.brucke.link';
export const MILLAU_SUBSTRATE_PROVIDER =
  process.env.REACT_APP_MILLAU_SUBSTRATE_PROVIDER || 'wss://wss.millau.brucke.link';

export const getProvider = (provider: string) => new WsProvider(provider);

export const getSS58Format = (envPrefix: string | undefined, defaultValue: number) => {
  if (envPrefix) {
    return parseInt(envPrefix);
  }
  return defaultValue;
};

export const chainsConfigs: ChainConfigs = {
  Millau: {
    SS58Format: getSS58Format(process.env.REACT_APP_MILLAU_SS58_PREFIX, 60),
    bridgeId: process.env.REACT_APP_MILLAU_BRIDGE_ID || 'mlau',
    hasher: hasherH512,
    provider: getProvider(MILLAU_SUBSTRATE_PROVIDER),
    types: customTypesMillau
  },
  Rialto: {
    SS58Format: getSS58Format(process.env.REACT_APP_RIALTO_SS58_PREFIX, 48),
    bridgeId: process.env.REACT_APP_RIALTO_BRIDGE_ID || 'rlto',
    provider: getProvider(RIALTO_SUBSTRATE_PROVIDER),
    types: customTypesRialto
  }
};
