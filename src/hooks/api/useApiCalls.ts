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
import { Text, Bytes } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { ApiCallsContextType } from '../../types/apiCallsTypes';
import useChainGetters from '../chain/useChainGetters';
import { formatBalance } from '@polkadot/util';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { getBridgeId } from '../../util/getConfigs';
import getDeriveAccount from '../../util/getDeriveAccount';
import { useKeyringContext } from '../../contexts/KeyringContextProvider';

const useApiCalls = (): ApiCallsContextType => {
  const {
    targetChainDetails: {
      apiConnection: { api: targetApi },
      chain: sourceChain,
      configs: sourceConfigs
    },
    sourceChainDetails: {
      apiConnection: { api: sourceApi },
      chain: targetChain,
      configs: targetConfigs
    }
  } = useSourceTarget();
  const { keyringPairs, keyringPairsReady } = useKeyringContext();
  const { getValuesByChain } = useChainGetters();

  const createType = useCallback(
    (chain, type, data) => {
      const { api } = getValuesByChain(chain);
      return api.registry.createType(type, data);
    },
    [getValuesByChain]
  );

  const stateCall = useCallback(
    (chain: string, methodName: string | Text, data: string | Uint8Array | Bytes, at) => {
      const { api } = getValuesByChain(chain);

      const params: [string | Text, string | Uint8Array | Bytes] = [methodName, data];
      if (at) {
        params.push(at);
      }

      return api.rpc.state.call<Codec>(...params);
    },
    [getValuesByChain]
  );

  const updateSenderBalances = useCallback(async () => {
    const formatBalanceAddress = (data: any) => {
      return {
        chainTokens: data.registry.chainTokens[0],
        formattedBalance: formatBalance(data.free, {
          decimals: sourceApi.registry.chainDecimals[0],
          withUnit: sourceApi.registry.chainTokens[0],
          withSi: true
        }),
        free: data.free
      };
    };

    if (!keyringPairsReady || !keyringPairs.length) {
      return {};
    }

    const sourceAddresses = await Promise.all(
      keyringPairs.map(async ({ address }) => {
        const toDerive = {
          ss58Format: targetConfigs.ss58Format,
          address: address || '',
          bridgeId: getBridgeId(targetConfigs, targetChain)
        };

        const { data } = await sourceApi.query.system.account(address);
        const sourceBalance = formatBalanceAddress(data);
        const companionAddress = getDeriveAccount(toDerive);
        const { data: dataCompanion } = await targetApi.query.system.account(companionAddress);
        const targetBalance = formatBalanceAddress(dataCompanion);

        return {
          account: { address, balance: sourceBalance },
          companionAccount: { address: companionAddress, balance: targetBalance }
        };
      })
    );

    const targetAddresses = await Promise.all(
      keyringPairs.map(async ({ address }) => {
        const toDerive = {
          ss58Format: sourceConfigs.ss58Format,
          address: address || '',
          bridgeId: getBridgeId(sourceConfigs, sourceChain)
        };

        const { data } = await targetApi.query.system.account(address);
        const sourceBalance = formatBalanceAddress(data);
        const companionAddress = getDeriveAccount(toDerive);
        const { data: dataCompanion } = await sourceApi.query.system.account(companionAddress);
        const targetBalance = formatBalanceAddress(dataCompanion);

        return {
          account: { address, balance: sourceBalance },
          companionAccount: { address: companionAddress, balance: targetBalance }
        };
      })
    );

    console.log('addresses', { [sourceChain]: sourceAddresses, [targetChain]: targetAddresses });
  }, [
    keyringPairsReady,
    keyringPairs,
    sourceChain,
    targetChain,
    sourceApi.registry.chainDecimals,
    sourceApi.registry.chainTokens,
    sourceApi.query.system,
    targetConfigs,
    targetApi.query.system,
    sourceConfigs
  ]);

  return { createType, stateCall, updateSenderBalances };
};

export default useApiCalls;
