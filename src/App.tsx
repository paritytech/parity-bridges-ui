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
import { Backdrop, CircularProgress } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { substrateProviders } from './configs';
import { AccountContextProvider } from './contexts/AccountContextProvider';
import { GUIContextProvider } from './contexts/GUIContextProvider';
import { KeyringContextProvider } from './contexts/KeyringContextProvider';
import { MessageContextProvider } from './contexts/MessageContext';
import { SourceTargetContextProvider } from './contexts/SourceTargetContextProvider';
import { TransactionContextProvider } from './contexts/TransactionContext';
import { SubscriptionsContextProvider } from './contexts/SubscriptionsContextProvider';
import { ApiCallsContextProvider } from './contexts/ApiCallsContextProvider';
import { useConnections } from './hooks/connections/useConnections';
import Main from './screens/Main';
import isEmpty from 'lodash/isEmpty';

const [connectionDetails1, connectionDetails2] = substrateProviders();

function App() {
  const { connections } = useConnections([connectionDetails1, connectionDetails2]);

  if (isEmpty(connections)) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <SourceTargetContextProvider connections={connections}>
      <KeyringContextProvider>
        <ApiCallsContextProvider>
          <AccountContextProvider>
            <GUIContextProvider>
              <SubscriptionsContextProvider>
                <MessageContextProvider>
                  <SnackbarProvider>
                    <TransactionContextProvider>
                      <BrowserRouter>
                        <Switch>
                          <Route path={'/'}>
                            <Main />
                          </Route>
                        </Switch>
                      </BrowserRouter>
                    </TransactionContextProvider>
                  </SnackbarProvider>
                </MessageContextProvider>
              </SubscriptionsContextProvider>
            </GUIContextProvider>
          </AccountContextProvider>
        </ApiCallsContextProvider>
      </KeyringContextProvider>
    </SourceTargetContextProvider>
  );
}

export default App;
