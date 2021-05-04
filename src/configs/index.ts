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
import { blake2AsU8a, keccakAsU8a } from '@polkadot/util-crypto';
import { checkEnvVariable } from '../util/envVariablesValidations';
import { Pairs } from '../types/sourceTargetTypes';
import { CHAIN_1, CHAIN_2 } from '../constants';
import { createPolkadotJsUrl } from '../util/createPolkadotJsUrl';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { ConnectionChainInformation } from '../types/sourceTargetTypes';
import customTypesMillau from './substrateCustomTypes/customTypesMillau.json';
import customTypesRialto from './substrateCustomTypes/customTypesRialto.json';

export interface HasherTypes {
  hasher?: (data: Uint8Array) => Uint8Array;
  types: ApiOptions['types'];
  polkadotjsUrl: string;
  provider: ProviderInterface;
}

function hasherH512(data: any) {
  return u8aConcat(blake2AsU8a(data), keccakAsU8a(data));
}

const getProviderInfo = (chainNumber: string, types: ApiOptions['types']) => {
  const providerUrl = checkEnvVariable(`REACT_APP_SUBSTRATE_PROVIDER_CHAIN_${chainNumber}`);
  const polkadotjsUrl = createPolkadotJsUrl(types!, providerUrl);
  return {
    provider: new WsProvider(providerUrl),
    polkadotjsUrl,
    types
  };
};

export const substrateProviders = (): ConnectionChainInformation[] => {
  const pair = checkEnvVariable('REACT_APP_PAIR');
  switch (pair) {
    case Pairs.RIALTO_MILLAU: {
      // Assuming chain1=Rialto - chain2=Millau
      const chain1 = getProviderInfo(CHAIN_1, customTypesRialto);
      const chain2 = getProviderInfo(CHAIN_2, customTypesMillau);

      return [
        {
          chainNumber: CHAIN_1,
          polkadotjsUrl: chain1.polkadotjsUrl,
          types: chain1.types,
          provider: chain1.provider
        },
        {
          chainNumber: CHAIN_2,
          hasher: hasherH512,
          polkadotjsUrl: chain2.polkadotjsUrl,
          types: chain2.types,
          provider: chain2.provider
        }
      ];
    }

    default:
      throw new Error(`Unknown chain: ${pair}`);
  }
};
