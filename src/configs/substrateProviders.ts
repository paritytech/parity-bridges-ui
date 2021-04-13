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

import { checkEnvVariable } from '../util/envVariablesValidations';
import { getConnectionChainInformation } from './substrateCustomTypes/';

export type CustomHasher = (data: Uint8Array) => Uint8Array;

interface ChainConfig {
  bridgeId: string;
  SS58Format: number;
}

interface ProviderConfig {
  hasher?: CustomHasher;
  types: ApiOptions['types'];
  provider: ProviderInterface;
  polkadotjsUrl: string;
}

interface ProviderConfigs {
  [chain: string]: ProviderConfig;
}

interface ChainConfigs {
  [chain: string]: ChainConfig;
}

const getChainNames = () => {
  return [checkEnvVariable('REACT_APP_CHAIN_1'), checkEnvVariable('REACT_APP_CHAIN_2')];
};

export const [CHAIN_1, CHAIN_2] = getChainNames();

const getTypeAndHasher = (chainNumber: string, providerUrl: string) =>
  getConnectionChainInformation(checkEnvVariable(`REACT_APP_CHAIN_${chainNumber}`), providerUrl);

const getProvider = (provider: string) => new WsProvider(provider);

const createConfigObject = (chainNumber: string) => {
  return {
    SS58Format: parseInt(checkEnvVariable(`REACT_APP_SS58_PREFIX_CHAIN_${chainNumber}`)),
    bridgeId: checkEnvVariable(`REACT_APP_BRIDGE_ID_CHAIN_${chainNumber}`)
  };
};

export const getChainConfigs = (): ChainConfigs => {
  const [chain1, chain2] = getChainNames();
  const configs = {
    [chain1]: createConfigObject('1'),
    [chain2]: createConfigObject('2')
  };

  return configs;
};

const createProviderObject = (chainNumber: string) => {
  const providerUrl = checkEnvVariable(`REACT_APP_SUBSTRATE_PROVIDER_CHAIN_${chainNumber}`);
  const { types, hasher, polkadotjsUrl } = getTypeAndHasher(chainNumber, providerUrl);
  return {
    hasher,
    polkadotjsUrl,
    provider: getProvider(providerUrl),
    types
  };
};

export const getChainProviders = (): ProviderConfigs => {
  const [chain1, chain2] = getChainNames();
  const providers = {
    [chain1]: createProviderObject('1'),
    [chain2]: createProviderObject('2')
  };

  return providers;
};
