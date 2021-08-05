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
import { AccountActionsTypes } from '../actions/accountActions';
import type { AccountsActionType, AccountState } from '../types/accountTypes';
import { getBridgeId } from '../util/getConfigs';
import getDeriveAccount from '../util/getDeriveAccount';

export default function accountReducer(state: AccountState, action: AccountsActionType): AccountState {
  switch (action.type) {
    case AccountActionsTypes.SET_ACCOUNT: {
      const { account, sourceTarget } = action.payload;
      const {
        targetChainDetails: {
          configs,

          apiConnection: { api: targetApi }
        },
        sourceChainDetails: { chain: sourceChain }
      } = sourceTarget;

      const toDerive = {
        ss58Format: configs.ss58Format,
        address: account?.address || '',
        bridgeId: getBridgeId(targetApi, sourceChain)
      };

      const companionAccount = getDeriveAccount(toDerive);

      return { ...state, account, companionAccount };
    }
    case AccountActionsTypes.SET_SENDER_BALANCES:
      return {
        ...state,
        senderAccountBalance: action.payload.senderAccountBalance,
        senderCompanionAccountBalance: action.payload.senderCompanionAccountBalance
      };
    case AccountActionsTypes.SET_ACCOUNTS:
      return { ...state, accounts: action.payload.accounts };
    case AccountActionsTypes.SET_DISPLAY_SENDER_ACCOUNTS:
      return { ...state, displaySenderAccounts: action.payload.displaySenderAccounts };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
