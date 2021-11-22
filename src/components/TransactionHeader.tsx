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

import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { IconTxStatus } from './Icons';
import { TransactionStatusEnum, TransactionTypes } from '../types/transactionTypes';

interface Props {
  status: TransactionStatusEnum;
  type?: string;
  sourceChain: string;
  targetChain: string;
  transferAmount?: string | null | undefined;
}

const useStyles = makeStyles((theme) => ({
  amount: {
    marginLeft: 'auto',
    color: theme.palette.primary.main,
    fontWeight: 500
  },
  header: {
    marginLeft: 5
  }
}));

const getType = (type: string | undefined) => {
  if (!type) {
    return type;
  }
  return type.replace('_', ' ');
};

const TransactionHeader = ({ type, status, sourceChain, targetChain, transferAmount }: Props) => {
  const classes = useStyles();
  let header = ` ${sourceChain} -> ${targetChain}`;
  if (type === TransactionTypes.INTERNAL_TRANSFER) {
    header = sourceChain;
  }

  return (
    <Box
      className="header"
      component="div"
      display="flex"
      alignItems="center"
      justifyContent="center"
      id="test-transaction-header"
    >
      <IconTxStatus status={status} />
      <Typography className={classes.header}>
        {getType(type)} {header}
      </Typography>
      <Typography className={classes.amount}>{transferAmount}</Typography>
    </Box>
  );
};

export default TransactionHeader;
