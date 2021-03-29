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

import { checkEnvVariable } from '../util/checkEnvVariables';
import { getCustomTypesAndHasher } from './substrateCustomTypes/';

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

const getChainNames = () => {
  const chainVarName = 'REACT_APP_CHAIN_';
  return [checkEnvVariable(`${chainVarName}1`), checkEnvVariable(`${chainVarName}2`)];
};

export const [CHAIN_1, CHAIN_2] = getChainNames();

const getProvider = (provider: string) => new WsProvider(provider);

const getTypeAndHasher = (chainNumber: string) =>
  getCustomTypesAndHasher(checkEnvVariable(`REACT_APP_CHAIN_${chainNumber}`));

const createConfigObject = (chainNumber: string) => {
  const { types, hasher } = getTypeAndHasher(chainNumber);
  return {
    SS58Format: parseInt(checkEnvVariable(`REACT_APP_SS58_PREFIX_CHAIN_${chainNumber}`)),
    bridgeId: checkEnvVariable(`REACT_APP_BRIDGE_ID_CHAIN_${chainNumber}`),
    hasher,
    provider: getProvider(checkEnvVariable(`REACT_APP_SUBSTRATE_PROVIDER_CHAIN_${chainNumber}`)),
    types
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
