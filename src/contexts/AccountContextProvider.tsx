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
