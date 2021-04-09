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

import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Dimmer, Loader } from 'semantic-ui-react';

import TopBar from './components/TopBar';
import { getChainProviders } from './configs/substrateProviders';
import { CHAIN_1, CHAIN_2 } from './configs/substrateProviders';
import { AccountContextProvider } from './contexts/AccountContextProvider';
import { KeyringContextProvider } from './contexts/KeyringContextProvider';
import { MessageContextProvider } from './contexts/MessageContext';
import { SourceTargetContextProvider } from './contexts/SourceTargetContextProvider';
import { TransactionContextProvider } from './contexts/TransactionContext';
import { useApiConnection } from './hooks/useApiConnection';
import Main from './screens/Main';

const providers = getChainProviders();

function App() {
  const apiChain1 = useApiConnection({ ...providers[CHAIN_1], chain: CHAIN_1 });
  const apiChain2 = useApiConnection({ ...providers[CHAIN_2], chain: CHAIN_2 });
  const connections = [
    { apiConnection: apiChain1, chainName: CHAIN_1 },
    { apiConnection: apiChain2, chainName: CHAIN_2 }
  ];

  if (!apiChain1.isApiReady || !apiChain2.isApiReady) {
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    );
  }

  return (
    <SourceTargetContextProvider connections={connections}>
      <MessageContextProvider>
        <SnackbarProvider>
          <KeyringContextProvider>
            <AccountContextProvider>
              <TransactionContextProvider>
                <BrowserRouter>
                  <Switch>
                    <Route path={'/'}>
                      <TopBar />
                      <Main />
                    </Route>
                  </Switch>
                </BrowserRouter>
              </TransactionContextProvider>
            </AccountContextProvider>
          </KeyringContextProvider>
        </SnackbarProvider>
      </MessageContextProvider>
    </SourceTargetContextProvider>
  );
}

export default App;
