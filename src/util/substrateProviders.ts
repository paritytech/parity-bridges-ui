// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
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
function hasher(data: any) {
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
  [CHAIN_2]: hasher
};

export const getProvider = (chain: string) => new WsProvider(providers[chain]);
