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

import React, { useContext, useReducer, useEffect, useState } from 'react';
import accountReducer from '../reducers/accountReducer';
import { AccountContextType, AccountsActionType } from '../types/accountTypes';
import { formatBalance } from '@polkadot/util';
import { useSourceTarget } from './SourceTargetContextProvider';
import { ApiPromise } from '@polkadot/api';
import getDeriveAccount from '../util/getDeriveAccount';
import { getBridgeId } from '../util/getConfigs';

interface AccountContextProviderProps {
  children: React.ReactElement;
}

export interface UpdateAccountContext {
  dispatchAccount: React.Dispatch<AccountsActionType>;
}

export const AccountContext: React.Context<AccountContextType> = React.createContext({} as AccountContextType);

export const UpdateAccountContext: React.Context<UpdateAccountContext> = React.createContext(
  {} as UpdateAccountContext
);

export function useAccountContext() {
  return useContext(AccountContext);
}

export function useUpdateAccountContext() {
  return useContext(UpdateAccountContext);
}

export function AccountContextProvider(props: AccountContextProviderProps): React.ReactElement {
  const { children = null } = props;
  const sourceTarget = useSourceTarget();
  const [balance, setBalance] = useState<null | Object>(null);

  const [accountState, dispatchAccount] = useReducer(accountReducer, {
    account: null,
    derivedAccount: null
  });

  useEffect(() => {
    const { account } = accountState;
    const getBalance = async (api: ApiPromise, address: string) => {
      const { data } = await api.query.system.account(address);
      setBalance({
        chainTokens: data.registry.chainTokens[0],
        formattedBalance: formatBalance(data.free, {
          decimals: api.registry.chainDecimals[0],
          withUnit: api.registry.chainTokens[0],
          withSi: true
        }),
        free: data.free
      });
      return {
        chainTokens: data.registry.chainTokens[0],
        formattedBalance: formatBalance(data.free, {
          decimals: api.registry.chainDecimals[0],
          withUnit: api.registry.chainTokens[0],
          withSi: true
        }),
        free: data.free
      };
    };

    const getBalanceCall = async () => {
      if (!account) {
        return;
      }
      const {
        targetChainDetails: {
          apiConnection: { api: targetApi },
          configs
        },
        sourceChainDetails: {
          apiConnection: { api: sourceApi },
          configs: { chainName }
        }
      } = sourceTarget;

      const accountBalance = await getBalance(sourceApi, account.address);

      /*       const toDerive = {
        ss58Format: configs.ss58Format,
        address: account.address,
        bridgeId: getBridgeId(configs, chainName)
      };
      const derivedAccount = getDeriveAccount(toDerive);
      const derivedAccountBalance = await getBalance(targetApi, derivedAccount); */

      console.log({ account, accountBalance /*  derivedAccount, derivedAccountBalance */ });
    };
    if (account) {
      getBalanceCall();
    }
  }, [accountState, sourceTarget, balance]);

  useEffect(() => {
    console.log('HAAA BEW BALAC', balance);
  }, [balance]);

  return (
    <AccountContext.Provider value={accountState}>
      <UpdateAccountContext.Provider value={{ dispatchAccount }}>{children}</UpdateAccountContext.Provider>
    </AccountContext.Provider>
  );
}
