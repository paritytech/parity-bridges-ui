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

import { Dispatch, useEffect } from 'react';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import useBalance from '../subscriptions/useBalance';
import { AccountActionCreators } from '../../actions/accountActions';
import { useKeyringContext } from '../../contexts/KeyringContextProvider';
import { AccountsActionType, AccountState } from '../../types/accountTypes';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';
import usePrevious from '../react/usePrevious';

const useAccountsContextSetUp = (accountState: AccountState, dispatchAccount: Dispatch<AccountsActionType>) => {
  const {
    targetChainDetails: {
      apiConnection: { api: targetApi }
    },
    sourceChainDetails: {
      apiConnection: { api: sourceApi }
    }
  } = useSourceTarget();

  const { keyringPairs, keyringPairsReady } = useKeyringContext();
  const { updateSenderAccountsInformation } = useApiCallsContext();

  const accountBalance = useBalance(sourceApi, accountState.account?.address || '', true);
  const companionBalance = useBalance(targetApi, accountState.companionAccount || '', true);
  const prevAccountBalance = usePrevious(accountBalance);
  const prevCompanionBalance = usePrevious(companionBalance);

  useEffect(() => {
    if (accountBalance !== prevAccountBalance || companionBalance !== prevCompanionBalance) {
      dispatchAccount(AccountActionCreators.setSenderBalances(accountBalance, companionBalance));
    }
  }, [accountBalance, companionBalance, dispatchAccount, prevAccountBalance, prevCompanionBalance]);

  useEffect(() => {
    if (keyringPairsReady && keyringPairs.length) {
      dispatchAccount(AccountActionCreators.setAccounts(keyringPairs));
    }
  }, [keyringPairsReady, keyringPairs, dispatchAccount, updateSenderAccountsInformation]);
};

export default useAccountsContextSetUp;
