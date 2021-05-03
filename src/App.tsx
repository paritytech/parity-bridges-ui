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

import { Backdrop, CircularProgress, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { light } from './components';
import { AccountContextProvider } from './contexts/AccountContextProvider';
import { KeyringContextProvider } from './contexts/KeyringContextProvider';
import { MessageContextProvider } from './contexts/MessageContext';
import { SourceTargetContextProvider } from './contexts/SourceTargetContextProvider';
import { TransactionContextProvider } from './contexts/TransactionContext';
import { useConnections } from './hooks/useConnections';
import Main from './screens/Main';

function App() {
  const { connections, apiReady } = useConnections();

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
