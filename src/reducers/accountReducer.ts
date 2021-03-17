// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import AccountActions from '../actions/accountActions';
import type { AccountsActionType, AccountState } from '../types/accountTypes';

export default function accountReducer(state: AccountState, action: AccountsActionType): AccountState {
  switch (action.type) {
    case AccountActions.SET_ACCOUNT:
      return { ...state, account: action.payload.account };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
