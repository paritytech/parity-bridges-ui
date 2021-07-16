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
import React from 'react';
import { Alert } from '.';
import { useKeyringContext } from '../contexts/KeyringContextProvider';
import useLoadingApi from '../hooks/connections/useLoadingApi';

interface Props {
  component: JSX.Element;
}

// TODO #176: Move this to a more generic error-show component
const statusFunc = (from: string, state: boolean) => `${from} chain status: ${!state ? 'disconnected' : 'connected'}`;

const ExtensionAccountCheck = ({ component }: Props): JSX.Element => {
  const { extensionExists, accountExists } = useKeyringContext();
  // TODO #176: Move this to a more generic error-show component
  const { sourceReady, targetReady } = useLoadingApi();
  const isDevelopment = process.env.REACT_APP_IS_DEVELOPMENT === 'true';
  const loadDevAccounts = process.env.REACT_APP_KEYRING_DEV_LOAD_ACCOUNTS === 'true';

  let msg: string = '';
  if (isDevelopment || loadDevAccounts) {
    return component;
  }

  if (!extensionExists) {
    msg = 'Connect to a wallet. Install polkadotjs extension';
  } else if (!accountExists) {
    msg = 'There are no accounts in the extension. Please create one';
    // TODO #176: Move this to a more generic error-show component
  } else if (!sourceReady || !targetReady) {
    msg = `${!sourceReady ? statusFunc('Source', sourceReady) : ''} ${
      !targetReady ? statusFunc('Target', targetReady) : ''
    }`;
  }

  return <>{msg ? <Alert severity="error">{msg}</Alert> : component}</>;
};

export default ExtensionAccountCheck;
