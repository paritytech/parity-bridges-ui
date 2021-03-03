// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import TopBar from './components/TopBar';
import { ApiPromiseSourceContextProvider } from './contexts/ApiPromiseSourceContext';
import { ApiPromiseTargetContextProvider } from './contexts/ApiPromiseTargetContext';
import { SourceTargetContextProvider } from './contexts/SourceTargetContextProvider';
import Main from './screens/Main';

function App() {
  return (
    <SourceTargetContextProvider>
      <ApiPromiseSourceContextProvider>
        <ApiPromiseTargetContextProvider>
          <BrowserRouter>
            <div className="App">
              <TopBar />
              <Switch>
                <Route path={'/'}>
                  <>
                    <Main />
                  </>
                </Route>
              </Switch>
            </div>
          </BrowserRouter>
        </ApiPromiseTargetContextProvider>
      </ApiPromiseSourceContextProvider>
    </SourceTargetContextProvider>
  );
}

export default App;
