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

type Components = React.ReactElement | { [key: string]: any };

interface ComposeProps {
  components: Components[];
  children: React.ReactElement;
}

export const Compose = ({ components, children }: ComposeProps): React.ReactElement => (
  <>
    {components.reverse().reduce((acc, curr) => {
      const [Provider, props] = Array.isArray(curr) ? [curr[0], curr[1]] : [curr, {}];
      return <Provider {...props}>{acc}</Provider>;
    }, children)}
  </>
);

function App() {
  return (
    <Compose
      components={[
        BrowserRouter,
        TransactionContextProvider,
        AccountContextProvider,
        KeyringContextProvider,
        ApiPromiseTargetContextProvider,
        ApiPromiseSourceContextProvider,
        SourceTargetContextProvider
      ]}
    >
      <div className="App">
        <TopBar />
        <Switch>
          <Route path={'/'}>
            <Main />
          </Route>
        </Switch>
      </div>
    </Compose>
  );
}

export default App;
