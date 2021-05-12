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

import { checkEnvVariable } from '../util/envVariablesValidations';
import { CHAIN_1, CHAIN_2 } from '../constants';
import { createPolkadotJsUrl } from '../util/createPolkadotJsUrl';
import { ConnectionChainInformation } from '../types/sourceTargetTypes';
import customTypesChain1 from './substrateCustomTypes/chain1.json';
import customTypesChain2 from './substrateCustomTypes/chain2.json';
import hashers from './chainsSetup/customHashers';

const getProviderInfo = (chainNumber: string, types: ApiOptions['types']) => {
  const providedHasher = process.env[`REACT_APP_CHAIN_${chainNumber}_CUSTOM_HASHER`];
  const providerUrl = checkEnvVariable(`REACT_APP_CHAIN_${chainNumber}_SUBSTRATE_PROVIDER`);

  const hasher = (providedHasher && hashers && hashers[providedHasher]) || undefined; // undefined is required because the hasher parameter in the api expects this in case there is no hasher.

  const polkadotjsUrl = createPolkadotJsUrl(types!, providerUrl);
  return {
    hasher,
    provider: new WsProvider(providerUrl),
    polkadotjsUrl,
    types
  };
};

export const substrateProviders = (): ConnectionChainInformation[] => {
  const chain1 = getProviderInfo(CHAIN_1, customTypesChain1);
  const chain2 = getProviderInfo(CHAIN_2, customTypesChain2);

  return [
    {
      chainNumber: CHAIN_1,
      hasher: chain1.hasher,
      polkadotjsUrl: chain1.polkadotjsUrl,
      types: chain1.types,
      provider: chain1.provider
    },
    {
      chainNumber: CHAIN_2,
      hasher: chain2.hasher,
      polkadotjsUrl: chain2.polkadotjsUrl,
      types: chain2.types,
      provider: chain2.provider
    }
  ];
};
