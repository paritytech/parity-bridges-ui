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
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { MessageActionsCreators } from '../actions/messageActions';
import { useUpdateMessageContext } from '../contexts/MessageContext';
import { KeyringContextType, KeyringStatuses } from '../types/keyringTypes';
import logger from '../util/logger';

interface KeyringContextProviderProps {
  children: React.ReactElement;
}

export const KeyringContext: React.Context<KeyringContextType> = React.createContext({} as KeyringContextType);
const loadDevAccounts = process.env.REACT_APP_KEYRING_DEV_LOAD_ACCOUNTS === 'true';

export function useKeyringContext() {
  return useContext(KeyringContext);
}

export function KeyringContextProvider(props: KeyringContextProviderProps): React.ReactElement {
  const { children = null } = props;
  const [keyringStatus, setKeyringStatus] = useState(KeyringStatuses.INIT);
  const { dispatchMessage } = useUpdateMessageContext();
  const [keyringPairs, setKeyringPairs] = useState<Array<KeyringPair>>([]);
  const [keyringPairsReady, setkeyringPairsReady] = useState<boolean>(false);
  const [extensionExists, setExtensionExists] = useState<boolean>(false);
  const [accountExists, setAccountExists] = useState<boolean>(false);

  const loadAccounts = useCallback(() => {
    const asyncLoadAccounts = async () => {
      setKeyringStatus(KeyringStatuses.LOADING);
      try {
        const extExists = await web3Enable('Substrate Bridges UI');
        if (extExists.length === 0 && !loadDevAccounts) {
          return;
        } else {
          setExtensionExists(true);
        }
        let allAccounts = await web3Accounts();
        allAccounts?.length && setAccountExists(true);
        allAccounts = allAccounts.map(({ address, meta }) => ({
          address,
          meta: { ...meta, name: `${meta.name}` }
        }));

        keyring.loadAll({ isDevelopment: loadDevAccounts }, allAccounts);
        setKeyringStatus(KeyringStatuses.READY);
      } catch (e) {
        dispatchMessage(MessageActionsCreators.triggerErrorMessage({ message: e }));
        logger.error(e);
        setKeyringStatus(KeyringStatuses.ERROR);
      }
    };

    if (keyringStatus === KeyringStatuses.LOADING || keyringStatus === KeyringStatuses.READY) return;

    asyncLoadAccounts();
  }, [dispatchMessage, keyringStatus]);

  useEffect(() => {
    if (keyringStatus === KeyringStatuses.INIT) {
      loadAccounts();
    }
  }, [keyringStatus, loadAccounts]);

  useEffect(() => {
    if (keyringStatus === KeyringStatuses.READY) {
      const keyringOptions = keyring.getPairs();
      setKeyringPairs(keyringOptions);
      setkeyringPairsReady(true);
    }
  }, [keyringStatus]);

  return (
    <KeyringContext.Provider value={{ accountExists, extensionExists, keyringPairs, keyringPairsReady }}>
      {children}
    </KeyringContext.Provider>
  );
}
