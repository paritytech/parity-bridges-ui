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

import { useEffect, useReducer } from 'react';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import useBalance from '../subscriptions/useBalance';
import { AccountActionCreators } from '../../actions/accountActions';
import accountReducer from '../../reducers/accountReducer';
import { useKeyringContext } from '../../contexts/KeyringContextProvider';
import { DisplayAccounts } from '../../types/accountTypes';

const useAccountsContextSetUp = () => {
  const {
    targetChainDetails: {
      apiConnection: { api: targetApi }
    },
    sourceChainDetails: {
      apiConnection: { api: sourceApi }
    }
  } = useSourceTarget();

  const { keyringPairs, keyringPairsReady } = useKeyringContext();

  const [accountState, dispatchAccount] = useReducer(accountReducer, {
    account: null,
    accounts: [],
    companionAccount: null,
    senderAccountBalance: null,
    senderCompanionAccountBalance: null,
    newAccounts: {} as DisplayAccounts
  });

  const accountBalance = useBalance(sourceApi, accountState.account?.address || '', true);
  const companionBalance = useBalance(targetApi, accountState.companionAccount || '', true);

  useEffect(() => {
    dispatchAccount(AccountActionCreators.setSenderBalances(accountBalance, companionBalance));
  }, [accountBalance, companionBalance, dispatchAccount]);

  useEffect(() => {
    if (keyringPairsReady && keyringPairs.length) {
      dispatchAccount(AccountActionCreators.setAccounts(keyringPairs));
    }
  }, [keyringPairsReady, keyringPairs, dispatchAccount]);

  return { accountState, dispatchAccount };
};

export default useAccountsContextSetUp;
