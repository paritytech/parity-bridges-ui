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

import { useCallback } from 'react';
import { Codec } from '@polkadot/types/types';
import { ApiCallsContextType } from '../../types/apiCallsTypes';
import useChainGetters from '../chain/useChainGetters';

const useApiCalls = (): ApiCallsContextType => {
  const { getValuesByChain } = useChainGetters();

  const createType = useCallback(
    (chain, type, data) => {
      const { api } = getValuesByChain(chain);
      return api.registry.createType(type, data);
    },
    [getValuesByChain]
  );

  const stateCall = useCallback(
    (chain, methodName, data, at) => {
      const { api } = getValuesByChain(chain);

      const params = [methodName, data];
      if (at) {
        params.push(at);
      }
      // @ts-ignore
      return api.rpc.state.call<Codec>(...params);
    },
    [getValuesByChain]
  );

  return { createType, stateCall };
};

export default useApiCalls;
