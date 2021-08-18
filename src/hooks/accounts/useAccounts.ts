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

import { AccountActionCreators } from '../../actions/accountActions';
import { SourceTargetActionsCreators } from '../../actions/sourceTargetActions';
import { useUpdateAccountContext } from '../../contexts/AccountContextProvider';
import { useUpdateSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { useAccountContext } from '../../contexts/AccountContextProvider';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { GENERIC_SUBSTRATE_PREFIX } from '../../constants';
import { encodeAddress } from '@polkadot/util-crypto';

interface Accounts {
  accounts: Array<KeyringPair> | [];
  setCurrentAccount: (account: string, sourceChain: string) => void;
}

const useAccounts = (): Accounts => {
  const { dispatchAccount } = useUpdateAccountContext();
  const { dispatchChangeSourceTarget } = useUpdateSourceTarget();
  const sourceTarget = useSourceTarget();
  const { accounts } = useAccountContext();

  const setCurrentAccount = useCallback(
    (account, sourceChain) => {
      const accountKeyring = accounts.find(
        ({ address }) => encodeAddress(account, GENERIC_SUBSTRATE_PREFIX) === address
      );

      console.log('accountKeyring', accountKeyring);
      dispatchChangeSourceTarget(SourceTargetActionsCreators.switchChains(sourceChain));
      dispatchAccount(AccountActionCreators.setAccount(accountKeyring!, sourceTarget, sourceChain));
    },
    [accounts, dispatchAccount, dispatchChangeSourceTarget, sourceTarget]
  );
  return {
    accounts,
    setCurrentAccount
  };
};

export default useAccounts;
