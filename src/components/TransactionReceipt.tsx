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

import { Box, Card, makeStyles, Typography } from '@material-ui/core';
import { IconTxStatus } from './Icons';
import { Step, TransactionStatusEnum } from '../types/transactionTypes';
import TransactionHeader from './TransactionHeader';
import { Web3Icon } from './Web3Icon';

interface Props {
  steps: Step[];
  status: TransactionStatusEnum;
  type?: string;
  sourceChain: string;
  targetChain: string;
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
    '&.MuiPaper-root': {
      maxWidth: '100%',
      padding: theme.spacing(2),
      borderRadius: theme.spacing(1.5)
    }
  }
}));

const TransactionReceipt = ({ type, steps, status, sourceChain, targetChain }: Props) => {
  const classes = useStyles();

  return (
    <Card elevation={23} className={classes.card}>
      <TransactionHeader type={type} status={status} sourceChain={sourceChain} targetChain={targetChain} />
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
    </Card>
  );
};

export default TransactionReceipt;
