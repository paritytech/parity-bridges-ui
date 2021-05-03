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
import { INCORRECT_FORMAT, GENERIC } from '../constants';
import { getChainConfigs } from '../configs/substrateProviders';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import getDeriveAccount from '../util/getDeriveAccount';

type State = {
  address: string;
  api: ApiPromise;
};

const useApiBalance = (address: string | null, chain: string | undefined, isDerived: boolean): State => {
  const {
    sourceChainDetails: {
      sourceApiConnection: { api: sourceApi },
      sourceChain
    },
    targetChainDetails: {
      targetApiConnection: { api: targetApi },
      targetChain
    }
  } = useSourceTarget();

  if (!chain || !address || chain === INCORRECT_FORMAT || chain === GENERIC) {
    return { address: '', api: {} as ApiPromise };
  }

  const chainsConfigs = getChainConfigs();
  const { SS58Format } = chainsConfigs[chain === targetChain ? targetChain : sourceChain];
  const { bridgeId } = chainsConfigs[chain === targetChain ? sourceChain : targetChain];
  const addressResult = !isDerived
    ? address
    : getDeriveAccount({
        SS58Format,
        address,
        bridgeId
      });

  const processedApi = chain === targetChain ? targetApi : sourceApi;

  return { address: addressResult, api: processedApi };
};

export default useApiBalance;
