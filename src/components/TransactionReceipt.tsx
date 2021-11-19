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

import { Box, makeStyles, Typography } from '@material-ui/core';
import { IconTxStatus } from './Icons';
import { Step } from '../types/transactionTypes';
import { Web3Icon } from './Web3Icon';

interface Props {
  steps: Step[];
}

const useStyles = makeStyles((theme) => ({
  card: {
    '& p': {
      ...theme.typography.body2
    },
    '& svg': {
      marginBottom: '-0.2em',
      fontSize: '1.2em',
      marginRight: theme.spacing()
    },
    '& .header': {
      fontWeight: 500
    },
    padding: theme.spacing(1)
  }
}));

const TransactionReceipt = ({ steps }: Props) => {
  const classes = useStyles();

  return (
    <Box className={classes.card}>
      {steps.map(({ chainType, label, labelOnChain, status, id }) => (
        <p key={id} id={id}>
          <IconTxStatus status={status} /> <Web3Icon>{chainType}</Web3Icon> {chainType}: {label}&nbsp;
          {labelOnChain && (
            <Box pt={0.25} pb={0.25} pl={0.5} pr={0.5} component="span" border={1} borderRadius={6}>
              <Typography component="span" variant="subtitle2">
                {labelOnChain}
              </Typography>
            </Box>
          )}
        </p>
      ))}
    </Box>
  );
};

export default TransactionReceipt;
