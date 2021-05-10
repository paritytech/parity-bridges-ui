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
import { INCORRECT_FORMAT } from '../constants';
import ctx from 'classnames';
import React from 'react';
interface Props {
  address?: string;
  formatFound?: string;
}

const useStyles = makeStyles(() => ({
  placeholder: {
    filter: 'grayscale(1)'
  }
}));

export default function AccountIdenticon({ address, formatFound }: Props) {
  const placeholder = !address || formatFound === INCORRECT_FORMAT;

  const value = !placeholder ? address : '1nUC7afqmo7zwRFWxDjrUQu9skk6fk99pafb4SiyGSRc8z3';

  const classes = useStyles();

  return <Identicon className={ctx(placeholder && classes.placeholder)} value={value} size={32} theme={'polkadot'} />;
}
