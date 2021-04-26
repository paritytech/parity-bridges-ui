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
import styled from 'styled-components';

import { useKeyringContext } from '../contexts/KeyringContextProvider';

interface Props {
  component: JSX.Element;
}

const ExtensionAccountCheck = ({ component }: Props): JSX.Element => {
  const { extensionExists, accountExists } = useKeyringContext();

  let msg: string = '';
  if (!extensionExists) {
    msg = 'Connect to a wallet. Install polkadotjs extension';
  } else if (!accountExists) {
    msg = 'There are no accounts in the extension. Please create one. Please create one';
  }

  return <>{accountExists ? component : <p className="messageNote">{msg}</p>}</>;
};

export default styled(ExtensionAccountCheck)`
  .messageNote {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    height: 50px;
    width: 100%;
    padding: 50px 0;
  }
`;
