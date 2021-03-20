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
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import TopBar from './components/TopBar';
import { AccountContextProvider } from './contexts/AccountContextProvider';
import { ApiPromiseSourceContextProvider } from './contexts/ApiPromiseSourceContext';
import { ApiPromiseTargetContextProvider } from './contexts/ApiPromiseTargetContext';
import { KeyringContextProvider } from './contexts/KeyringContextProvider';
import { SourceTargetContextProvider } from './contexts/SourceTargetContextProvider';
import { TransactionContextProvider } from './contexts/TransactionContext';
import Main from './screens/Main';

function App() {
  return (
    <SourceTargetContextProvider>
      <ApiPromiseSourceContextProvider>
        <ApiPromiseTargetContextProvider>
          <KeyringContextProvider>
            <AccountContextProvider>
              <TransactionContextProvider>
                <BrowserRouter>
                  <div className="App">
                    <TopBar />
                    <Switch>
                      <Route path={'/'}>
                        <Main />
                      </Route>
                    </Switch>
                  </div>
                </BrowserRouter>
              </TransactionContextProvider>
            </AccountContextProvider>
          </KeyringContextProvider>
        </ApiPromiseTargetContextProvider>
      </ApiPromiseSourceContextProvider>
    </SourceTargetContextProvider>
  );
}

export default App;
