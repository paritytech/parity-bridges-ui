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

import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { light } from './components';
import { CHAIN_1, CHAIN_2, getChainProviders } from './configs/substrateProviders';
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
    { apiConnection: apiChain1, chainName: CHAIN_1, polkadotjsUrl: providers[CHAIN_1].polkadotjsUrl },
    { apiConnection: apiChain2, chainName: CHAIN_2, polkadotjsUrl: providers[CHAIN_2].polkadotjsUrl }
  ];

  const apiReady = apiChain1.isApiReady && apiChain2.isApiReady;

  if (!apiReady) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
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
                      <ThemeProvider theme={createMuiTheme(light)}>
                        <Main />
                      </ThemeProvider>
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
