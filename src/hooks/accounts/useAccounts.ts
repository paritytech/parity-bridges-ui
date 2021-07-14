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

import { useCallback } from 'react';
import type { KeyringPair } from '@polkadot/keyring/types';
import { encodeAddress } from '@polkadot/util-crypto';
import { AccountActionCreators } from '../../actions/accountActions';
import { SourceTargetActionsCreators } from '../../actions/sourceTargetActions';
import { useUpdateAccountContext } from '../../contexts/AccountContextProvider';
import { useAccountContext } from '../../contexts/AccountContextProvider';
import { useUpdateSourceTarget } from '../../contexts/SourceTargetContextProvider';
import useDerivedAccount from './useDerivedAccount';
import useChainGetters from '../chain/useChainGetters';

interface Accounts {
  account: KeyringPair | null;
  accounts: Array<KeyringPair> | [];
  derivedAccount: string | null;
  setCurrentAccount: (value: string, chain: string) => void;
}

const useAccounts = (): Accounts => {
  const { dispatchAccount } = useUpdateAccountContext();
  const { dispatchChangeSourceTarget } = useUpdateSourceTarget();
  const derivedAccount = useDerivedAccount();
  const { account, accounts } = useAccountContext();
  const { getSS58PrefixByChain } = useChainGetters();

  const setCurrentAccount = useCallback(
    (value: string, chain: string) => {
      const ss58Format = getSS58PrefixByChain(chain);

      const account = accounts.find(({ address }) => encodeAddress(address, ss58Format) === value);
      if (account) {
        dispatchChangeSourceTarget(SourceTargetActionsCreators.switchChains(chain));
        dispatchAccount(AccountActionCreators.setAccount(account));
      }
    },
    [accounts, dispatchAccount, dispatchChangeSourceTarget, getSS58PrefixByChain]
  );

  return {
    account,
    accounts,
    derivedAccount,
    setCurrentAccount
  };
};

export default useAccounts;
