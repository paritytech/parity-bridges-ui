// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//copied over from @substrate/context This needs to be updated.

import React, { useContext, useReducer } from 'react';

import accountReducer from '../reducers/accountReducer';
import { AccountContextType, AccountsActionType } from '../types/accountTypes';

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

  const [account, dispatchAccount] = useReducer(accountReducer, { account: null });

  return (
    <AccountContext.Provider value={account}>
      <UpdateAccountContext.Provider value={{ dispatchAccount }}>{children}</UpdateAccountContext.Provider>
    </AccountContext.Provider>
  );
}
