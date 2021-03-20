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

//copied over from @substrate/context This needs to be updated.

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';
import React, { useContext, useEffect, useReducer, useState } from 'react';

import KeyringActions from '../actions/keyringActions';
import keyringReducer from '../reducers/keyringReducer';
import { KeyringContextType, KeyringStatuses } from '../types/keyringTypes';
import { chainsConfigs } from '../util/substrateProviders';
import { useSourceTarget } from './SourceTargetContextProvider';

interface KeyringContextProviderProps {
  children: React.ReactElement;
}

export const KeyringContext: React.Context<KeyringContextType> = React.createContext({} as KeyringContextType);

export function useKeyringContext() {
  return useContext(KeyringContext);
}

const INIT_STATE = {
  keyring: null,
  keyringStatus: null
};

export function KeyringContextProvider(props: KeyringContextProviderProps): React.ReactElement {
  const { children = null } = props;
  const { sourceChain } = useSourceTarget();
  const { ss58Formats } = chainsConfigs;
  const sourceChainSS58Format = ss58Formats[sourceChain];
  const initState = { ...INIT_STATE };
  const [state, dispatch] = useReducer(keyringReducer, initState);
  const [keyringPairs, setKeyringPairs] = useState<Array<KeyringPair>>([]);
  const [keyringPairsReady, setkeyringPairsReady] = useState(false);

  const { keyringStatus } = state;
  const isDevelopment = Boolean(process.env.REACT_APP_KEYRING_DEV_LOAD_ACCOUNTS);

  let loadAccts = false;
  const loadAccounts = () => {
    const asyncLoadAccounts = async () => {
      dispatch({ type: KeyringActions.LOAD_KEYRING });
      try {
        await web3Enable('Substrate Bridges UI');
        let allAccounts = await web3Accounts();
        allAccounts = allAccounts.map(({ address, meta }) => ({
          address,
          meta: { ...meta, name: `${meta.name} (${meta.source})` }
        }));
        keyring.loadAll({ isDevelopment, ss58Format: sourceChainSS58Format }, allAccounts);
        dispatch({ type: KeyringActions.SET_KEYRING });
      } catch (e) {
        console.error(e);
        dispatch({ type: KeyringActions.KEYRING_ERROR });
      }
    };

    const { keyringStatus } = state;
    // If `keyringStatus` is not null `asyncLoadAccounts` is running.
    if (keyringStatus) return;
    // If `loadAccts` is true, the `asyncLoadAccounts` has been run once.
    if (loadAccts) return dispatch({ type: KeyringActions.SET_KEYRING });

    // This is the heavy duty work
    loadAccts = true;
    asyncLoadAccounts();
  };

  useEffect(() => {
    const { keyringStatus } = state;
    if (!keyringStatus) {
      loadAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    const { keyringStatus } = state;
    if (keyringStatus === KeyringStatuses.READY) {
      const keyringOptions = keyring.getPairs();
      setKeyringPairs(keyringOptions);
      setkeyringPairsReady(true);
    }
  }, [keyringStatus, state]);

  return <KeyringContext.Provider value={{ keyringPairs, keyringPairsReady }}>{children}</KeyringContext.Provider>;
}
