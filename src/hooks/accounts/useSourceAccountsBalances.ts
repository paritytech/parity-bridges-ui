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

import { useEffect } from 'react';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { getBridgeId } from '../../util/getConfigs';
import getDeriveAccount from '../../util/getDeriveAccount';
import useBalance from '../subscriptions/useBalance';
import { AccountState } from '../../types/accountTypes';
import { AccountActionCreators } from '../../actions/accountActions';
import { useKeyringContext } from '../../contexts/KeyringContextProvider';
import { formatBalance } from '@polkadot/util';

const useSourceAccountsBalances = (accountState: AccountState, dispatchAccount: Function) => {
  const {
    targetChainDetails: {
      apiConnection: { api: targetApi },
      configs
    },
    sourceChainDetails: {
      apiConnection: { api: sourceApi },
      configs: { chainName }
    }
  } = useSourceTarget();
  const { keyringPairs } = useKeyringContext();
  const accountBalance = useBalance(sourceApi, accountState.account?.address || '', true);

  const toDerive = {
    ss58Format: configs.ss58Format,
    address: accountState.account?.address || '',
    bridgeId: getBridgeId(configs, chainName)
  };
  const companionAccount = getDeriveAccount(toDerive);
  const companionBalance = useBalance(targetApi, companionAccount || '', true);

  useEffect(() => {
    dispatchAccount(AccountActionCreators.setSenderBalances(accountBalance, companionBalance));
    dispatchAccount(AccountActionCreators.setSenderCompanionAccount(companionAccount));
  }, [accountBalance, companionAccount, companionBalance, dispatchAccount]);

  useEffect(() => {
    const getAccounts = async () => {
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

      const addresses = await Promise.all(
        keyringPairs.map(async ({ address }) => {
          const toDerive = {
            ss58Format: configs.ss58Format,
            address: address || '',
            bridgeId: getBridgeId(configs, chainName)
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

      console.log('addresses', addresses);
    };

    if (keyringPairs.length) {
      getAccounts();
    }
  }, [
    chainName,
    configs,
    keyringPairs,
    sourceApi.query.system,
    sourceApi.query.system.account,
    sourceApi.registry.chainDecimals,
    sourceApi.registry.chainTokens,
    targetApi.query.system,
    targetApi.query.system.account
  ]);
};

export default useSourceAccountsBalances;
