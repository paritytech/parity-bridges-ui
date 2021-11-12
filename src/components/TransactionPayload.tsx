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

/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useCallback } from 'react';
import { Card, makeStyles, CircularProgress, Typography } from '@material-ui/core';
import ReactJson from 'react-json-view';
import TransactionHeader from './TransactionHeader';
import { MessageActionsCreators } from '../actions/messageActions';
import { useTransactionContext } from '../contexts/TransactionContext';
import { DisplayPayload, SwitchTabEnum, TransactionStatusEnum } from '../types/transactionTypes';
import { useUpdateMessageContext } from '../contexts/MessageContext';

export interface TransactionDisplayProps {
  size?: 'sm';
}

interface Props {
  transactionDisplayProps?: TransactionDisplayProps;
  tab: SwitchTabEnum;
  payloadHex: string | null;
  transactionDisplayPayload: DisplayPayload | null;
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

const TransactionPayload = ({ tab, payloadHex, transactionDisplayPayload }: Props) => {
  const classes = useStyles();
  const { payloadEstimatedFeeLoading } = useTransactionContext();
  const { dispatchMessage } = useUpdateMessageContext();

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(transactionDisplayPayload));
    dispatchMessage(
      MessageActionsCreators.triggerSuccessMessage({
        message: 'Payload copied'
      })
    );
  }, [dispatchMessage, transactionDisplayPayload]);

  if (tab === SwitchTabEnum.RECEIPT) {
    return null;
  }

  return (
    <Card elevation={23} className={classes.card}>
      {payloadHex && <p>Aca iba el header</p>}
      {payloadEstimatedFeeLoading && (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      )}
      {!payloadEstimatedFeeLoading && tab === SwitchTabEnum.PAYLOAD && (
        <Typography variant="subtitle2">{payloadHex}</Typography>
      )}
      {!payloadEstimatedFeeLoading && tab === SwitchTabEnum.DECODED && transactionDisplayPayload && (
        <div onClick={onCopy}>
          <Typography variant="subtitle2">
            <ReactJson
              src={transactionDisplayPayload}
              enableClipboard={false}
              name={false}
              style={{ cursor: 'copy' }}
            />
          </Typography>
        </div>
      )}
    </Card>
  );
};

export default TransactionPayload;
