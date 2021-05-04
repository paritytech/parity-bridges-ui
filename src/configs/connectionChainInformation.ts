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

import { checkEnvVariable } from '../util/envVariablesValidations';
import { createPolkadotJsUrl } from '../util/createPolkadotJsUrl';
import { getSubstrateConfigs } from './substrateConfigs';
import { ConnectionChainInformation } from '../types/sourceTargetTypes';

const getProvider = (provider: string) => new WsProvider(provider);

const getConnectionChainInformation = (chainNumber: string): ConnectionChainInformation => {
  const providerUrl = checkEnvVariable(`REACT_APP_SUBSTRATE_PROVIDER_CHAIN_${chainNumber}`);
  const provider = getProvider(providerUrl);
  const [chain1, chain2] = getSubstrateConfigs();
  switch (chainNumber) {
    case '1':
      return {
        chainNumber,
        hasher: chain1.hasher,
        polkadotjsUrl: createPolkadotJsUrl(chain1.types!, providerUrl),
        provider,
        types: chain1.types
      };
    case '2':
      return {
        chainNumber,
        hasher: chain2.hasher,
        polkadotjsUrl: createPolkadotJsUrl(chain2.types!, providerUrl),
        provider,
        types: chain2.types
      };

    default:
      throw new Error(`Unknown chain: ${chainNumber}`);
  }
};

export { getConnectionChainInformation };
