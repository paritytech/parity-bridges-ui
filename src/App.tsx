// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import './App.css';

//import { WsProvider } from '@polkadot/api';
import React from 'react';

import { ApiPromiseSourceContextProvider } from './contexts/ApiPromiseSourceContext';
import { ApiPromiseTargetContextProvider } from './contexts/ApiPromiseTargetContext';
import { SourceTargetContextProvider } from './contexts/SourceTargetContextProvider';
import logo from './logo.svg';
import Test from './Test';

function App() {
	return (
		<SourceTargetContextProvider>
			<ApiPromiseSourceContextProvider>
				<ApiPromiseTargetContextProvider>
					<div className="App">
						<header className="App-header">
							<img src={logo} className="App-logo" alt="logo" />
							<p>
					Edit <code>src/App.tsx</code> and save to reload.
							</p>

							<a
								className="App-link"
								href="https://reactjs.org"
								target="_blank"
								rel="noopener noreferrer"
							>
					Learn React
							</a>
						</header>
						<Test />
					</div>
				</ApiPromiseTargetContextProvider>
			</ApiPromiseSourceContextProvider>
		</SourceTargetContextProvider>

	);
}

export default App;
