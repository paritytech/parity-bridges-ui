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

import { ApiPromise } from '@polkadot/api';
import { TransactionState } from '../../types/transactionTypes';
import { initTransactionState } from '../initReducersStates/initTransactionState';

export const state: TransactionState = initTransactionState;

const api: jest.Mocked<ApiPromise> = {
  consts: {
    bridgechain1Messages: {
      //@ts-ignore
      bridgedId: {
        toU8a: () => new Uint8Array([1, 2, 3])
      }
    }
  }
};

export const sourceConfigs = {
  chainName: 'chain1',
  ss58Format: 48
};

export const targetConfigs = {
  chainName: 'chain2',
  ss58Format: 60
};

export const sourceChainDetails = {
  configs: sourceConfigs,
  api: {} as ApiPromise,

  chain: 'chain1',
  polkadotjsUrl: 'url1'
};

export const targetChainDetails = {
  configs: targetConfigs,
  apiConnection: {
    api,
    isApiReady: true
  },
  chain: 'chain2',
  polkadotjsUrl: 'url2'
};
