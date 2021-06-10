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

import { TransactionActionCreators } from '../../actions/transactionActions';
import type { KeyringPair } from '@polkadot/keyring/types';
import { encodeAddress } from '@polkadot/util-crypto';
import { useEffect, useState } from 'react';
import { useUpdateTransactionContext } from '../../contexts/TransactionContext';
import { AccountActionCreators } from '../../actions/accountActions';
import { SourceTargetActionsCreators } from '../../actions/sourceTargetActions';
import { useUpdateAccountContext } from '../../contexts/AccountContextProvider';
import { useAccountContext } from '../../contexts/AccountContextProvider';
import { useKeyringContext } from '../../contexts/KeyringContextProvider';
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
  const { keyringPairs, keyringPairsReady } = useKeyringContext();
  const [accounts, setAccounts] = useState<Array<KeyringPair> | []>([]);
  const { dispatchAccount } = useUpdateAccountContext();
  const { dispatchChangeSourceTarget } = useUpdateSourceTarget();
  const derivedAccount = useDerivedAccount();
  const { account } = useAccountContext();
  const { getValuesByChain } = useChainGetters();
  const { dispatchTransaction } = useUpdateTransactionContext();

  useEffect(() => {
    if (keyringPairsReady && keyringPairs.length) {
      setAccounts(keyringPairs);
    }
  }, [keyringPairsReady, keyringPairs, setAccounts]);

  const setCurrentAccount = (value: string, chain: string) => {
    const { ss58Format } = getValuesByChain(chain);

    const account = accounts.find(({ address }) => encodeAddress(address, ss58Format) === value);
    if (account) {
      dispatchChangeSourceTarget(SourceTargetActionsCreators.switchChains(chain));
      dispatchTransaction(TransactionActionCreators.setUnformattedReceiverAddress(null));
      dispatchAccount(AccountActionCreators.setAccount(account));
    }
  };

  return {
    account,
    accounts,
    derivedAccount,
    setCurrentAccount
  };
};

export default useAccounts;
