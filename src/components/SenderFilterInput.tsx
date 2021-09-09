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
import { Box, InputBase, makeStyles } from '@material-ui/core';
import { SelectLabel } from '.';
import AccountIdenticon from './AccountIdenticon';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';

interface Props {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const useStyles = makeStyles((theme) => ({
  box: {
    padding: theme.spacing(1)
  },
  input: {
    marginLeft: theme.spacing(1)
  }
}));

export default function SenderFilterInput({ handleChange }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.box}>
      <SelectLabel>Sender</SelectLabel>
      <Box display="flex" alignItems="center">
        <AccountIdenticon />
        <InputBase
          placeholder="select address or start typing"
          onChange={handleChange}
          fullWidth
          className={classes.input}
        />
        <ArrowDropUp color="primary" />
      </Box>
    </div>
  );
}
