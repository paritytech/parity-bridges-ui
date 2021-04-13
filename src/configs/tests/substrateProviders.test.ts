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

import { checkEnvVariable, checkExpectedVariables } from '../../util/envVariablesValidations';
import { getConnectionChainInformation } from '../substrateCustomTypes/';
import { getChainConfigs, getChainProviders } from '../substrateProviders';

jest.mock('@polkadot/api', () => {
  return {
    WsProvider: function (value: string) {
      return { connection: `ws://${value}` };
    }
  };
});

jest.mock('../substrateCustomTypes/');
jest.mock('../../util/envVariablesValidations');

describe('getChainConfigs', () => {
  const chain1 = 'CHAIN1';
  const chain2 = 'CHAIN2';
  const prefix1 = '11';
  const prefix2 = '22';
  const wsProvider1 = 'provider1';
  const wsProvider2 = 'provider2';
  const bridgeId1 = 'bridge1';
  const bridgeId2 = 'bridge2';

  const expectedConfig = {
    [chain1]: {
      SS58Format: 11,
      bridgeId: bridgeId1
    },
    [chain2]: {
      SS58Format: 22,
      bridgeId: bridgeId2
    }
  };

  const expectedProviders = {
    [chain1]: {
      hasher: `${chain1}Hasher`,
      provider: { connection: `ws://${wsProvider1}` },
      types: `${chain1}Types`
    },
    [chain2]: {
      hasher: `${chain2}Hasher`,
      provider: { connection: `ws://${wsProvider2}` },
      types: `${chain2}Types`
    }
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = {};
    (getConnectionChainInformation as jest.Mock).mockImplementation((value) => ({
      hasher: `${value}Hasher`,
      types: `${value}Types`
    }));

    (checkEnvVariable as jest.Mock).mockImplementation((value) => process.env[value]);
    (checkExpectedVariables as jest.Mock).mockImplementation(() => true);
  });

  afterEach(() => {
    (getConnectionChainInformation as jest.Mock).mockClear();
    (getConnectionChainInformation as jest.Mock).mockReset();
    (checkEnvVariable as jest.Mock).mockClear();
    (checkEnvVariable as jest.Mock).mockReset();
    (checkExpectedVariables as jest.Mock).mockClear();
    (checkExpectedVariables as jest.Mock).mockReset();
    process.env = {};
  });

  test('Should validate and return chain value according env value', () => {
    process.env.REACT_APP_CHAIN_1 = chain1;
    process.env.REACT_APP_CHAIN_2 = chain2;
    process.env.REACT_APP_BRIDGE_ID_CHAIN_1 = bridgeId1;
    process.env.REACT_APP_BRIDGE_ID_CHAIN_2 = bridgeId2;
    process.env.REACT_APP_SS58_PREFIX_CHAIN_1 = prefix1;
    process.env.REACT_APP_SS58_PREFIX_CHAIN_2 = prefix2;

    expect(getChainConfigs()).toEqual(expectedConfig);
  });

  test('Should validate and return chain value according env value', () => {
    process.env.REACT_APP_CHAIN_1 = chain1;
    process.env.REACT_APP_CHAIN_2 = chain2;
    process.env.REACT_APP_SUBSTRATE_PROVIDER_CHAIN_1 = wsProvider1;
    process.env.REACT_APP_SUBSTRATE_PROVIDER_CHAIN_2 = wsProvider2;

    expect(getChainProviders()).toEqual(expectedProviders);
  });

  test('Should validate and return chain value according env value', () => {
    (checkExpectedVariables as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    try {
      getChainConfigs();
      fail('it should not reach here');
    } catch (e) {
      console.log('Thrown exception as expected');
    }
  });
});
