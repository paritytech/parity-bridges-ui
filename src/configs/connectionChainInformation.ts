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
import { u8aConcat } from '@polkadot/util';
import { ApiOptions } from '@polkadot/api/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { blake2AsU8a, keccakAsU8a } from '@polkadot/util-crypto';
import { checkEnvVariable } from '../util/envVariablesValidations';
import { createPolkadotJsUrl } from '../util/createPolkadotJsUrl';
import { getSubstrateConfigs } from './substrateCustomTypes';

export interface ConnectionChainInformation {
  hasher?: (data: Uint8Array) => Uint8Array;
  provider: ProviderInterface;
  types?: ApiOptions['types'];
  polkadotjsUrl: string;
}

function hasherH512(data: any) {
  return u8aConcat(blake2AsU8a(data), keccakAsU8a(data));
}

const getProvider = (provider: string) => new WsProvider(provider);

const getConnectionChainInformation = (chainNumber: string): ConnectionChainInformation => {
  const providerUrl = checkEnvVariable(`REACT_APP_SUBSTRATE_PROVIDER_CHAIN_${chainNumber}`);
  const provider = getProvider(providerUrl);
  const [chain1, chain2] = getSubstrateConfigs();
  switch (chainNumber) {
    case '1':
      return {
        polkadotjsUrl: createPolkadotJsUrl(chain1.types!, providerUrl),
        provider,
        types: chain1.types
      };
    case '2':
      return {
        hasher: hasherH512,
        polkadotjsUrl: createPolkadotJsUrl(chain2.types!, providerUrl),
        provider,
        types: chain2.types
      };

    default:
      throw new Error(`Unknown chain: ${chainNumber}`);
  }
};

export { getConnectionChainInformation };
