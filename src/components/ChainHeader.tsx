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

import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import ChainLogo from './ChainLogo';

interface Props {
  chain: string;
}

const useStyles = makeStyles((theme) => ({
  box: {
    padding: theme.spacing(1.7)
  },
  name: {
    marginLeft: theme.spacing(0.8),
    color: theme.palette.grey[600],
    fontWeight: 500
  }
}));

export default function ChainHeader({ chain }: Props) {
  const classes = useStyles();
  return (
    <Box display="flex" className={classes.box}>
      <ChainLogo chain={chain} />
      <Typography classes={{ root: classes.name }}>{chain.toUpperCase()}</Typography>
    </Box>
  );
}
