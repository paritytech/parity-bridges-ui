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
import { ApiCallsContextType } from '../types/apiCallsTypes';
import useChainGetters from '../hooks/useChainGetters';

const useApiCalls = (): ApiCallsContextType => {
  const { getValuesByChain } = useChainGetters();
  const getChainValues = useCallback((chain) => getValuesByChain(chain), [getValuesByChain]);

  const sendBridgeMessage = useCallback(
    (chain, laneId, payload, estimatedFee) => {
      const {
        api,
        substrateValues: { bridgedMessages }
      } = getChainValues(chain);
      return api.tx[bridgedMessages].sendMessage(laneId, payload, estimatedFee);
    },
    [getChainValues]
  );

  const getBlock = useCallback(
    (chain, asInBlock) => {
      const { api } = getChainValues(chain);
      return api.rpc.chain.getBlock(asInBlock);
    },
    [getChainValues]
  );

  const getBlockHash = useCallback(
    (chain, blockNumber) => {
      const { api } = getChainValues(chain);
      return api.rpc.chain.getBlockHash(blockNumber);
    },
    [getChainValues]
  );

  const createType = useCallback(
    (chain, type, data) => {
      const { api } = getChainValues(chain);
      return api.registry.createType(type, data);
    },
    [getChainValues]
  );

  const stateCall = useCallback(
    (chain, data, at) => {
      const {
        api,
        substrateValues: { estimatedFeeMethodName }
      } = getChainValues(chain);

      const params = [estimatedFeeMethodName, data];
      if (at) {
        params.push(at);
      }
      // @ts-ignore
      return api.rpc.state.call<Codec>(...params);
    },
    [getChainValues]
  );

  const derive = useCallback(
    (chain) => {
      const { api } = getChainValues(chain);
      return api.derive.chain;
    },
    [getChainValues]
  );

  return { sendBridgeMessage, getBlock, getBlockHash, createType, stateCall, derive };
};

export default useApiCalls;
