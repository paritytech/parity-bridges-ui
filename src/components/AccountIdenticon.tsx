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

import { makeStyles } from '@material-ui/core/styles';
import Identicon from '@polkadot/react-identicon';
import React from 'react';
interface Props {
  address?: string;
  placeholder?: boolean;
}

const useStyles = makeStyles(() => ({
  placeholder: {
    opacity: '30%'
  }
}));

export default function AccountIdenticon({ address, placeholder = false }: Props) {
  const classes = useStyles();
  if (placeholder) {
    return (
      <div className={classes.placeholder}>
        <Identicon value={'1nUC7afqmo7zwRFWxDjrUQu9skk6fk99pafb4SiyGSRc8z3'} size={32} theme={'polkadot'} />
      </div>
    );
  }
  return <Identicon value={address} size={32} theme={'polkadot'} />;
}
