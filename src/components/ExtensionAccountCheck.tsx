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
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React from 'react';

import { useKeyringContext } from '../contexts/KeyringContextProvider';

interface Props {
  component: JSX.Element;
}

const Alert = (props: JSX.IntrinsicAttributes & AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const ExtensionAccountCheck = ({ component }: Props): JSX.Element => {
  const { extensionExists, accountExists } = useKeyringContext();

  let msg: string = '';
  if (!extensionExists) {
    msg = 'Connect to a wallet. Install polkadotjs extension';
  } else if (!accountExists) {
    msg = 'There are no accounts in the extension. Please create one';
  }

  return <>{accountExists ? component : <Alert severity="error">{msg}</Alert>}</>;
};

export default ExtensionAccountCheck;
