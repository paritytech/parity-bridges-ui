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

import type { Account, BalanceState } from '../types/accountTypes';
import type { SourceTargetState } from '../types/sourceTargetTypes';

import { KeyringPair } from '@polkadot/keyring/types';

enum AccountActionsTypes {
  SET_ACCOUNT = 'SET_ACCOUNT',
  SET_ACCOUNTS = 'SET_ACCOUNTS',
  SET_SENDER_BALANCES = 'SET_SENDER_BALANCES'
}

const setAccount = (account: Account, sourceTarget: SourceTargetState) => ({
  payload: { account, sourceTarget },
  type: AccountActionsTypes.SET_ACCOUNT
});

const setSenderBalances = (
  senderAccountBalance: BalanceState | null,
  senderCompanionAccountBalance: BalanceState | null
) => ({
  payload: { senderAccountBalance, senderCompanionAccountBalance },
  type: AccountActionsTypes.SET_SENDER_BALANCES
});

const setAccounts = (accounts: KeyringPair[]) => ({
  payload: { accounts },
  type: AccountActionsTypes.SET_ACCOUNTS
});

const AccountActionCreators = {
  setAccount,
  setAccounts,
  setSenderBalances
};

export { AccountActionsTypes, AccountActionCreators };
