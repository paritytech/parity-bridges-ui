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
import { INCORRECT_FORMAT, GENERIC } from '../../constants';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { getBridgeId } from '../../util/getConfigs';
import getDeriveAccount from '../../util/getDeriveAccount';

type State = {
  address: string;
  api: ApiPromise;
};

const useApiBalance = (address: string | null, chain: string | undefined | null, isDerived: boolean): State => {
  const {
    sourceChainDetails: {
      apiConnection: { api: sourceApi },
      chain: sourceChain,
      configs: sourceConfigs
    },
    targetChainDetails: {
      apiConnection: { api: targetApi },
      chain: targetChain,
      configs: targetConfigs
    }
  } = useSourceTarget();

  if (!chain || !address || chain === INCORRECT_FORMAT || chain === GENERIC) {
    return { address: '', api: {} as ApiPromise };
  }

  const ss58Format = chain === targetChain ? targetConfigs.ss58Format : sourceConfigs.ss58Format;

  const bridgeId = chain === targetChain ? getBridgeId(targetApi, sourceChain) : getBridgeId(sourceApi, targetChain);

  const addressResult = !isDerived
    ? address
    : getDeriveAccount({
        ss58Format,
        address,
        bridgeId
      });

  const processedApi = chain === targetChain ? targetApi : sourceApi;

  return { address: addressResult, api: processedApi };
};

export default useApiBalance;
