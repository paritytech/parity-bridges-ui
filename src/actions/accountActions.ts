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

import type { Account } from '../types/accountTypes';

enum AccountActionsTypes {
  SET_ACCOUNT = 'SET_ACCOUNT',
  SET_DERIVED_ACCOUNT = 'SET_DERIVED_ACCOUNT ',
  SET_GENERIC_ACCOUNT = 'SET_GENERIC_ACCOUNT '
}

const setAccount = (account: Account) => ({
  payload: { account },
  type: AccountActionsTypes.SET_ACCOUNT
});

const setGenericAccount = (genericAccount: string | null) => ({
  payload: { genericAccount },
  type: AccountActionsTypes.SET_GENERIC_ACCOUNT
});

const setDerivedAccount = (derivedAccount: string | null) => ({
  payload: { derivedAccount },
  type: AccountActionsTypes.SET_DERIVED_ACCOUNT
});

const AccountActionCreators = {
  setAccount,
  setDerivedAccount,
  setGenericAccount
};

export { AccountActionsTypes, AccountActionCreators };
