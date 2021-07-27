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
import { Card, makeStyles, CircularProgress, Typography } from '@material-ui/core';
import ReactJson from 'react-json-view';
import { SwitchTabEnum } from '../types/transactionTypes';
import TransactionHeader from './TransactionHeader';
import { useTransactionContext } from '../contexts/TransactionContext';
import { TransactionDisplayPayload } from '../types/transactionTypes';
import { TransactionStatusEnum } from '../types/transactionTypes';

export interface TransactionDisplayProps {
  size?: 'sm';
}

interface Props {
  transactionDisplayProps?: TransactionDisplayProps;
  tab: SwitchTabEnum;
  payloadHex: string | null;
  transactionDisplayPayload: TransactionDisplayPayload | null;
  status: TransactionStatusEnum;
  type?: string;
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
    },
    wordBreak: 'break-word'
  },
  loader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));

const TransactionPayload = ({
  tab,
  transactionDisplayProps,
  payloadHex,
  transactionDisplayPayload,
  type,
  status
}: Props) => {
  const classes = useStyles();
  const { payloadEstimatedFeeLoading } = useTransactionContext();
  if (tab === SwitchTabEnum.RECEIPT) {
    return null;
  }

  return (
    <Card elevation={transactionDisplayProps?.size === 'sm' ? 23 : 24} className={classes.card}>
      {payloadHex && <TransactionHeader type={type} status={status} />}
      {payloadEstimatedFeeLoading && (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      )}
      {!payloadEstimatedFeeLoading && tab === SwitchTabEnum.PAYLOAD && (
        <Typography variant="subtitle2">{payloadHex}</Typography>
      )}
      {!payloadEstimatedFeeLoading && tab === SwitchTabEnum.DECODED && transactionDisplayPayload && (
        <Typography variant="subtitle2">
          <ReactJson src={transactionDisplayPayload} enableClipboard name={false} />
        </Typography>
      )}
    </Card>
  );
};

export default TransactionPayload;
